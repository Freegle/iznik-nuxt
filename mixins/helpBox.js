export default {
  data: {
    id: null
  },
  computed: {
    helpKey() {
      return 'help-' + this.id
    },
    showHelp() {
      return !this.$store.getters['misc/get'](this.helpKey)
    }
  },
  methods: {
    toggleHelp() {
      this.$store.dispatch('misc/set', {
        key: this.helpKey,
        value: this.showHelp
      })
    }
  }
}
