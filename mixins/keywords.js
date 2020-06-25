export default {
  computed: {
    typeOptions() {
      return [
        {
          value: 'Offer',
          text:
            this.group &&
            this.group.settings &&
            this.group.settings.keywords &&
            this.group.settings.keywords.offer
              ? this.group.settings.keywords.offer
              : 'OFFER'
        },
        {
          value: 'Wanted',
          text:
            this.group &&
            this.group.settings &&
            this.group.settings.keywords &&
            this.group.settings.keywords.wanted
              ? this.group.settings.keywords.wanted
              : 'WANTED'
        }
      ]
    },
    group() {
      return this.groupid
        ? this.$store.getters['auth/groupById'](this.groupid)
        : null
    },
    groupid() {
      let ret = null

      if (this.member) {
        ret = this.member.groupid
      } else if (
        this.message &&
        this.message.groups &&
        this.message.groups.length
      ) {
        ret = this.message.groups[0].groupid
      }

      return ret
    }
  }
}
