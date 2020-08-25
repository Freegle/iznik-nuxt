<template>
  <div v-if="groups && groups.length">
    <b-card v-if="show" bg-light class="recentviews">
      <b-btn variant="link" class="float-right" @click="hideit">
        Hide this
      </b-btn>
      <b-card-title title-tag="h2" class="header--size4">
        Nearby Communities
      </b-card-title>
      <p>
        Other Freegle communities near to you:
      </p>
      <div v-for="(group, index) in groups" :key="'group-' + group.id">
        <div :class="index > 1 ? 'd-none d-md-block mb-2' : 'mb-2'">
          <b-button variant="secondary" size="sm" @click="join(group.id)">
            Join {{ group.namedisplay }}
          </b-button>
          <span class="small text-muted">
            {{ group.polydist }} miles away.  Or click
            <nuxt-link :to="'/explore/' + group.nameshort">
              here
            </nuxt-link>
            to browse.
          </span>
        </div>
      </div>
    </b-card>
    <div v-else class="text-info text-right clickme" @click="showit">
      Show nearby communities
    </div>
  </div>
</template>
<script>
export default {
  name: 'NearbyGroups',
  computed: {
    groups() {
      const ret = []

      const me = this.$store.getters['auth/user']
      if (
        me &&
        me.settings &&
        me.settings.mylocation &&
        me.settings.mylocation.name
      ) {
        const list = Object.values(this.$store.getters['locations/list'])
        list.forEach(l => {
          if (l.id === me.settings.mylocation.id) {
            if (l.groupsnear) {
              l.groupsnear.forEach(g => {
                if (
                  ret.length < 3 &&
                  !this.$store.getters['auth/member'](g.id)
                ) {
                  const distallowed =
                    'nearbygroups' in g.settings ? g.settings.nearbygroups : 5

                  // We want to use polydist because that's the distance to the group area, not to the centre.
                  console.log(g.nameshort, g.polydist, distallowed)
                  if (g.polydist <= distallowed) {
                    // Make distance pretty.
                    if (g.polydist > 1) {
                      g.polydist = Math.round(g.polydist * 10) / 10
                    }

                    ret.push(g)
                  }
                }
              })
            }
          }
        })
      }

      return ret
    },
    show() {
      return !this.$store.getters['misc/get']('hidenearbygroups')
    }
  },
  watch: {
    groups(newVal) {
      if (newVal && newVal.length) {
        this.$api.bandit.shown({
          uid: 'nearbygroups',
          variant: 'hide'
        })

        this.$api.bandit.shown({
          uid: 'nearbygroups',
          variant: 'join'
        })
      }
    }
  },
  mounted() {
    this.fetchNearby()
  },
  methods: {
    hideit() {
      this.$store.dispatch('misc/set', {
        key: 'hidenearbygroups',
        value: true
      })

      this.$api.bandit.chosen({
        uid: 'nearbygroups',
        variant: 'hide'
      })
    },
    showit() {
      this.$store.dispatch('misc/set', {
        key: 'hidenearbygroups',
        value: false
      })
    },
    async join(groupid) {
      this.$api.bandit.chosen({
        uid: 'nearbygroups',
        variant: 'join'
      })

      const me = this.$store.getters['auth/user']

      await this.$store.dispatch('auth/joinGroup', {
        userid: me.id,
        groupid: groupid
      })

      await this.fetchNearby()
    },
    async fetchNearby() {
      const me = this.$store.getters['auth/user']
      if (
        me &&
        me.settings &&
        me.settings.mylocation &&
        me.settings.mylocation.name
      ) {
        await this.$store.dispatch('locations/fetch', {
          typeahead: me.settings.mylocation.name
        })
      }
    }
  }
}
</script>
