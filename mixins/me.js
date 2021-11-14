// Global mixin so that every component can access the logged in state and user.
import Vue from 'vue'
import union from 'lodash/union'

let fetchingMeComponents = []
let fetchingPromise = null

Vue.mixin({
  computed: {
    me() {
      return this.realMe
    },
    realMe() {
      // We have this separate method so that components can override me() and still access the real user if they
      // need to. This is used by impersonation.
      const me = this.$store.getters['auth/user']
      return me && me.id ? me : null
    },
    myid() {
      return this.me ? this.me.id : null
    },
    loggedIn() {
      return this.me !== null
    },
    myGroups() {
      return this.me ? this.$store.getters['auth/groups'] : []
    },
    anyGroups() {
      return this.myGroups.length > 0
    },
    myLocation() {
      return this.me &&
        this.me.settings &&
        this.me.settings.mylocation &&
        this.me.settings.mylocation.name
        ? this.me.settings.mylocation
        : null
    },
    mod() {
      return (
        this.me &&
        (this.me.systemrole === 'Moderator' ||
          this.me.systemrole === 'Support' ||
          this.me.systemrole === 'Admin')
      )
    },
    support() {
      return this.me && this.me.systemrole === 'Support'
    },
    admin() {
      return this.me && this.me.systemrole === 'Admin'
    },
    supportOrAdmin() {
      return (
        this.me &&
        (this.me.systemrole === 'Support' || this.me.systemrole === 'Admin')
      )
    },
    simple() {
      let ret = true

      if (!this.me) {
        // Always show simple for logged out.
        ret = true
        // console.log('Logged out - simple')
      } else if (
        this.me.settings &&
        (this.me.settings.simple === true || this.me.settings.simple === false)
      ) {
        // We have a preference.
        ret = this.me.settings.simple
        // console.log('Preference - simple', ret)
      } else if (
        this.me.added &&
        Date.now() - new Date(this.me.added).getTime() < 3 * 24 * 60 * 60 * 1000
      ) {
        // We have no preference and we're a new user.
        ret = true
        // console.log('No preference, new', this.me.added)
      } else {
        // We have no preference and we're an established user.
        ret = false
        // console.log('No preference, established')
      }

      // console.log('compute simple', ret, this.me)
      return ret
    },
    // Permissions. We have these as individual computed properties so they can be cached.
    hasPermissionNewsletter() {
      return this.hasPermission('Newsletter')
    },
    hasPermissionSpamAdmin() {
      return this.hasPermission('SpamAdmin')
    },
    hasPermissionGiftAid() {
      return this.hasPermission('GiftAid')
    },
    supporter() {
      return this.me && this.me.supporter
    },
    donor() {
      return this.me && this.me.donor
    },
    amMicroVolunteering() {
      return (
        this.me &&
        (this.me.trustlevel === 'Basic' ||
          this.me.trustlevel === 'Moderate' ||
          this.me.trustlevel === 'Advanced')
      )
    }
  },
  methods: {
    oneOfMyGroups(groupid) {
      return this.myGroups.find(g => {
        return g.id === groupid
      })
    },
    myGroup(groupid) {
      return groupid
        ? this.myGroups.find(g => parseInt(g.id) === groupid)
        : null
    },
    hasPermission(perm) {
      const perms = this.me ? this.me.permissions : null
      return perms && perms.indexOf(perm) !== -1
    },
    amAModOn(groupid) {
      const member = this.$store.getters['auth/member'](groupid)
      return member === 'Moderator' || member === 'Owner'
    },
    amActiveModOn(groupid) {
      const groups = this.$store.getters['auth/groups']

      let ret = false

      groups.forEach(g => {
        if (g.id === groupid) {
          ret = true

          if (g.mysettings && 'active' in g.mysettings) {
            ret = this.amAModOn(groupid) && g.mysettings.active
          }
        }
      })

      return ret
    },
    async fetchMe(components, hitServer) {
      // We can be called in several ways.
      //
      // - hitServer = true.  We must query the server, and wait for the response before returning.  This is used
      //   mostly when we really care about the data being tightly in sync, and occasionally when we want to
      //   ensure that the server call has completed (e.g. in timers).  You would always call this with await.
      //
      // - hitServer = false
      //   - with await.  We must have the components we are querying, but it's ok for them to be a little out of
      //     date.  If we have them in hand we can return but fire off a server request to make sure they are up
      //     to date soon.  If we don't, we must hit the server and wait.
      //   - without await.  We just want to trigger an update but don't much care when it happens.
      //
      // Inside this function we can't tell whether an await is used, but this comment is for the callers :-).
      //
      // Because multiple pages/components may call fetchMe to ensure that they have data they need, we
      // want to minimise the number of calls.  We have some fairly complex logic below to keep track of what
      // we are currently fetching so that we can keep the number of parallel calls down and return earlier if
      // we happen to already be fetching what we need.
      // const uniqueid = await this.$store.dispatch('uniqueid/generate')
      const modtools = this.$store.getters['misc/get']('modtools')

      if (!modtools) {
        // Always fetch the number of replies we're expecting.
        components.push('expectedreplies')
      }

      let needToFetch = false

      if (!hitServer) {
        // We don't have to hit the server before we return, but we might need to if there are components missing.
        // console.log(uniqueid + ' Check for missing components')

        let me = this.$store.getters['auth/user']

        for (const component of components) {
          if (component !== 'me' && me && !me[component]) {
            // There is some information that we need which we don't have.  We must hit the server and wait.
            // console.log(
            //   uniqueid + ' Missing component:',
            //   component,
            //   JSON.stringify(fetchingMeComponents)
            // )
            if (fetchingMeComponents.indexOf(component) !== -1) {
              // We are in the process of fetching the missing component, so we just need to wait until that
              // completes.
              // console.log(
              //   uniqueid + ' ...but already fetching, so wait',
              //   component
              // )
              await fetchingPromise
              // console.log(
              //   uniqueid + ' ...wait for already fetching complete',
              //   component
              // )

              // We may have more info in the store.
              me = this.$store.getters['auth/user']
            } else {
              // console.log(
              //   uniqueid + ' ...not fetching so will need to do so',
              //   component
              // )
              break
            }
          }
        }

        // We always need to fetch to do the background update.
        needToFetch = true
      } else {
        // We have been asked to hit the server.  But it's possible that we are already fetching all the
        // components we need, in which case there is no point.
        //
        // ...probably.  There's a theoretical issue where a request starts, then something makes a change
        // and calls us to fetch it, and the first request is still in transit and returns data before the
        // change.  But this doesn't happen in our code, unless you're reading this comment and have
        // just figured out that it does.
        // console.log(uniqueid + ' asked to hit server')
        components.forEach(c => {
          if (!needToFetch && !fetchingMeComponents.includes(c)) {
            // console.log(uniqueid + ' not already fetching', c)
            needToFetch = true
          }
        })

        if (!needToFetch) {
          // console.log(uniqueid + ' already fetching everything we need, wait')
          await fetchingPromise
          // console.log(uniqueid + ' already fetching wait complete')
        }
      }

      if (needToFetch) {
        fetchingMeComponents = union(components, fetchingMeComponents)
        // console.log(
        //   uniqueid + ' Stored fetching',
        //   JSON.stringify(fetchingMeComponents)
        // )
        const thisPromise = this.$store.dispatch('auth/fetchUser', {
          components
        })

        fetchingPromise = fetchingPromise
          ? Promise.all([fetchingPromise, thisPromise])
          : thisPromise

        if (hitServer) {
          // We need to wait for the server before returning.
          // console.log(
          //   uniqueid + ' Hit server and wait for ',
          //   JSON.stringify(components)
          // )
          await fetchingPromise
          // console.log(
          //   uniqueid + ' ...wait complete for hitserver',
          //   JSON.stringify(components)
          // )
          fetchingMeComponents = fetchingMeComponents.filter(
            x => !components.includes(x)
          )
          // console.log(uniqueid + ' Fetching complete for hit server')
          fetchingPromise = null
        } else {
          // We can return immediately, but hit the server to keep us up to date.
          // console.log(
          //   uniqueid + ' Return but fire off request for',
          //   JSON.stringify(components)
          // )
          fetchingPromise.then(() => {
            // console.log(
            //   uniqueid + ' ...background fetch complete for',
            //   JSON.stringify(components)
            // )
            fetchingMeComponents = fetchingMeComponents.filter(
              x => !components.includes(x)
            )
            // console.log(uniqueid + ' Fetching complete for background')
            fetchingPromise = null
          })
        }
      }

      // console.log(uniqueid + ' returning')
    }
  }
})
