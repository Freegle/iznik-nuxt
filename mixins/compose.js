export default {
  data: function() {
    return {
      postType: null,
      submitting: false,
      invalid: false,
      initialPostcode: null,
      notAllowed: false,
      wentWrong: false
    }
  },
  computed: {
    group: {
      set(group) {
        this.$store.dispatch('compose/setGroup', group)
      },
      get() {
        const groupid = this.$store.getters['compose/getGroup']
        return groupid ? this.$store.getters['group/get'](groupid) : null
      }
    },
    closed() {
      let ret = false

      if (this.group && this.group.settings && this.group.settings.closed) {
        ret = true
      }

      return ret
    },
    extgroup() {
      const groupid = this.$store.getters['compose/getGroup']

      if (this.postcode && this.postcode.groupsnear) {
        for (const group of this.postcode.groupsnear) {
          if (group.id === groupid) {
            return group.external
          }
        }
      }

      return null
    },
    ids() {
      const messages = Object.values(this.$store.getters['compose/getMessages'])

      let ids = []
      for (const message of messages) {
        if (
          message.id &&
          message.type === this.postType &&
          (!message.savedBy || message.savedBy === this.myid)
        ) {
          ids.push(message.id)
        }
      }

      if (ids.length === 0) {
        ids = [this.getId()]
      }

      return ids
    },
    notblank() {
      let ret = false
      const messages = Object.values(this.$store.getters['compose/getMessages'])
      if (messages && messages.length > 0) {
        const message = messages[0]

        const atts = Object.values(
          this.$store.getters['compose/getAttachments'](message.id)
        )

        ret =
          (message.item && message.item.trim()) ||
          (message.description && message.description.trim()) ||
          atts.length
      }

      return ret
    },
    valid() {
      const messages = Object.values(
        this.$store.getters['compose/getMessages']
      ).filter(m => {
        return m.id && m.type === this.postType
      })

      const pc = this.$store.getters['compose/getPostcode']
      let valid = false

      if (messages && messages.length && this.ids && pc) {
        valid = true

        for (const message of messages) {
          const atts = Object.values(
            this.$store.getters['compose/getAttachments'](message.id)
          )

          // A message is valid if there is an item, and either a description or a photo.
          if (
            !message.item ||
            !message.item.trim() ||
            ((!message.description || !message.description.trim()) &&
              !atts.length)
          ) {
            valid = false
          }
        }
      }

      return valid
    },
    uploadingPhoto() {
      return this.$store.getters['compose/getUploading']
    },
    postcode: {
      get() {
        return this.$store.getters['compose/getPostcode']
      },
      set(pc) {
        this.$store.dispatch('compose/setPostcode', pc)
      }
    },
    postcodeValid() {
      return this.postcode && this.postcode.name
    },
    email: {
      get() {
        let email = null
        const user = this.$store.getters['auth/user']

        // See if we have a local email stored from last time we were logged in.
        email = this.$store.getters['compose/getEmail']

        if (!email && user && user.email) {
          // If we're logged in, then we have an email from that which takes precedence.
          email = user.email
        }

        return email
      },
      set(newValue) {
        this.$store.dispatch('compose/setEmail', newValue)
      }
    },
    emailIsntOurs() {
      let ret = false

      if (this.email && this.me) {
        ret = !this.me.emails.find(e => {
          return (
            this.email
              .toLowerCase()
              .trim()
              .localeCompare(e.email.toLowerCase().trim()) === 0
          )
        })
      }

      return ret
    }
  },
  created() {
    if (this.$route.query.postcode) {
      this.initialPostcode = this.$route.query.postcode
    }
  },
  mounted() {
    // We want to refetch the group in case its closed status has changed.
    const groupid = this.$store.getters['compose/getGroup']

    if (groupid) {
      this.$store.dispatch('group/fetch', {
        id: groupid
      })
    }

    // We also want to prune any old messages from our store.
    this.$store.dispatch('compose/prune')
  },
  methods: {
    deleteItem() {
      this.$store.dispatch('compose/clearMessage', {
        id: this.ids[this.ids.length - 1]
      })
    },
    postcodeClear() {
      this.postcode = null
      this.group = null
    },
    postcodeSelect(pc) {
      const currentpc = this.$store.getters['compose/getPostcode']

      if (!currentpc || currentpc.id !== pc.id) {
        // The postcode has genuinely changed or been set for the first time.  We don't want to go through this code
        // if the postcode is the same, otherwise we'll reset the group (which might have been changed from the first,
        // for example in the give flow if you choose a different group.
        this.$store.dispatch('compose/setPostcode', pc)

        // If we don't have a group currently which is in the list near this postcode, choose the closest.  That
        // allows people to select further away groups if they wish.
        const groupid = this.$store.getters['compose/getGroup']

        if (pc && pc.groupsnear) {
          let found = false
          for (const group of pc.groupsnear) {
            if (parseInt(group.id) === parseInt(groupid)) {
              found = true
            }
          }

          if (!found) {
            this.group = pc.groupsnear[0].id
          } else {
            this.group = groupid
          }
        }
      }
    },
    getId() {
      // Find a new id.  Use the messages because ids is filtered by type.
      let nextId = -1
      const messages = Object.values(this.$store.getters['compose/getMessages'])

      for (const message of messages) {
        nextId = Math.min(message.id, nextId)
      }

      nextId--

      return nextId
    },
    addItem() {
      const id = this.getId()

      this.$store.dispatch('compose/setMessage', {
        id: id,
        item: null,
        description: null,
        type: this.postType,
        availablenow: 1
      })
    },
    async freegleIt(type) {
      this.submitting = true

      try {
        const results = await this.$store.dispatch('compose/submit', {
          type: type
        })

        // The params we pass from the results may crucially include new user information,
        // and depending on timing this may not appear in the first result, so look for one of those first.
        const params = {
          justPosted: [],
          newuser: null,
          newpassword: null
        }

        results.forEach(async res => {
          if (res.newuser) {
            params.newuser = res.newuser
            params.newpassword = res.newpassword

            // Fetch the session so that we know we're logged in, and so that we have permission to fetch messages
            // below.
            await this.$store.dispatch('auth/fetchUser', {
              components: ['me', 'groups'],
              force: true
            })
          }
        })

        // Fetch the message and group we posted on so that it's in the store for the next page - it might not be if
        // we weren't a member or logged in.  Do this before we navigate as it looks nicer that way.
        //
        // All posts are made to the same group so it's ok to check just the first.  The group should be in store.
        const promises = []

        if (results.length > 0 && results[0].groupid) {
          const groupid = results[0].groupid
          const group = this.$store.getters['group/get'](groupid)

          if (!group) {
            promises.push(
              this.$store.dispatch('group/fetch', {
                id: groupid
              })
            )
          }

          results.forEach(res => {
            params.justPosted.push(res.id)

            promises.push(
              this.$store.dispatch('messages/fetch', {
                id: res.id
              })
            )
          })

          await Promise.all(promises)

          this.$router.push({
            name: 'myposts',
            params: params
          })
        } else {
          // Was probably already submitted
          this.$router.push({
            name: 'myposts'
          })
        }
      } catch (e) {
        console.log('Submit failed', e)
        if (e.message.indexOf('Not allowed to post on this group') !== -1) {
          this.notAllowed = true
        } else {
          this.wentWrong = true
        }
      }
    },
    emailInUse(email) {
      // If we are logged in, and we have an email address in hand which is not one of our own, then this is
      // worth knowing because it suggests that the user is confused and has multiple accounts.  Check with the
      // server whether this email is in use by another account.
      return this.$store.dispatch('user/emailIsInUse', {
        email: email
      })
    }
  }
}
