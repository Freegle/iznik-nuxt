import InfiniteLoading from 'vue-infinite-loading'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  layout: 'modtools',
  components: { InfiniteLoading },
  mixins: [loginRequired],
  props: {
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      distance: 1000,
      limit: 50,
      show: 0,
      busy: false
    }
  },
  computed: {
    logs() {
      return this.$store.getters['logs/list']
    }
  },
  watch: {},
  mounted() {
    this.$store.dispatch('logs/clear')
  },
  methods: {
    loadMore: async function($state) {
      this.busy = true
      this.$emit('busy')
      const params = this.$store.getters['logs/params']

      if (this.show < this.logs.length) {
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.logs.length

        try {
          await this.$store.dispatch('logs/fetch', {
            limit: this.limit,
            groupid: this.groupid,
            logtype: params.type,
            search: params.search
          })

          const logs = this.$store.getters['logs/list']

          if (currentCount === logs.length) {
            this.complete = true
            $state.complete()
          } else {
            $state.loaded()
            this.show++
          }
        } catch (e) {
          $state.complete()
          console.log('Complete on error', e)
        }
      }

      this.busy = false
      this.$emit('idle')
    }
  }
}
