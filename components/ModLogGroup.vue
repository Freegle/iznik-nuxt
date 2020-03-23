<template>
  <span v-if="loggroup">
    {{ tag }}
    <a :href="'https://www.ilovefreegle.org/explore/' + loggroup.nameshort" target="_blank">{{ groupname }}</a>
  </span>
</template>
<script>
export default {
  props: {
    log: {
      type: Object,
      required: false,
      default: null
    },
    tag: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    loggroup() {
      if (this.log.group) {
        return this.log.group
      } else if (
        this.log.message &&
        this.log.message.groups &&
        this.log.message.groups.length
      ) {
        return this.log.message.groups[0]
      } else if (this.log.groupid) {
        // We have a groupid.  The group objects are not passed back from the server but we might be able to find it in:
        // - a user
        // - a message
        let ret = this.scanUserForGroup(this.log.user)

        if (!ret) {
          ret = this.scanUserForGroup(this.log.byuser)
        }

        if (!ret) {
          // We might know it - should be one of ours if we're looking at the logs.
          ret = this.$store.getters['auth/groupById'](this.log.groupid)
        }

        return ret

        // this.scanMessageForGroup(this.log.message)
      } else {
        return null
      }
    },
    groupname() {
      return this.loggroup.nameshort || this.loggroup.namedisplay
    }
  },
  methods: {
    scanUserForGroup(user) {
      let ret = null

      if (user) {
        if (user.applied) {
          user.applied.forEach(g => {
            if (g.id === this.log.groupid) {
              ret = g
            }
          })
        }

        if (!ret && user.memberof) {
          user.memberof.forEach(g => {
            if (g.id === this.log.groupid) {
              ret = g
            }
          })
        }
      }

      console.log('Returning', ret, this.log)
      return ret
    }
  }
}
</script>
