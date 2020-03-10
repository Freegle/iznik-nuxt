<script>
import Vue from 'vue'

export default {
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    },
    groupName: {
      type: String,
      required: true
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  data: function() {
    return {
      askfor: null,
      loading: false
    }
  },
  watch: {
    groupid(newVal, oldVal) {
      this.maybeFetch()
    },
    start(newVal, oldVal) {
      this.maybeFetch()
    },
    end(newVal, oldVal) {
      this.maybeFetch()
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      if (
        this.askfor &&
        this.start &&
        this.end &&
        this.askfor &&
        this.askfor.length
      ) {
        this.loading = true
        const res = await this.$api.dashboard.fetch({
          components: this.askfor,
          start: this.start.toISOString(),
          end: this.end.toISOString(),
          allgroups: !this.groupid,
          group: this.groupid
        })

        Object.keys(res).forEach(comp => {
          // eslint-disable-next-line
          Vue.set(this, comp, res[comp])
        })

        this.loading = false
      }
    },
    maybeFetch() {
      if (!this.loading) {
        this.loading = true

        this.$nextTick(() => {
          this.fetch()
        })
      }
    }
  }
}
</script>
