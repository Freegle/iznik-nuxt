export default {
  data: {
    postType: null
  },
  computed: {
    ids() {
      const messages = Object.values(this.$store.getters['compose/getMessages'])

      let ids = []
      for (const message of messages) {
        if (message.id && message.type === this.postType) {
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
      const messages = Object.values(this.$store.getters['compose/getMessages'])
      let valid = false

      if (messages && messages.length && this.ids) {
        valid = true

        for (const message of messages) {
          if (this.ids.indexOf(message.id) !== -1 || !message.id) {
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
      }

      return valid
    },

    uploadingPhoto() {
      return this.$store.getters['compose/getUploading']
    },
    postcode() {
      return this.$store.getters['compose/getPostcode']
    },
    email: {
      get() {
        let email = null
        const user = this.$store.getters['auth/user']

        if (user && user.email) {
          // If we're logged in, then we have an email from that which takes precedence.
          email = user.email

          // Save it in case we're logged out next time.
          this.$store.dispatch('compose/setEmail', email)
        } else {
          // See if we have a local email stored from last time we were logged in.
          email = this.$store.getters['compose/getEmail']
        }

        return email
      },
      set(newValue) {
        this.$store.dispatch('compose/setEmail', newValue)
      }
    }
  },
  methods: {
    deleteItem() {
      this.$store.dispatch('compose/clearMessage', {
        id: this.ids[this.ids.length - 1]
      })
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

          this.$store.dispatch('compose/setGroup', this.group)
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
        type: this.postType
      })
    }
  }
}
