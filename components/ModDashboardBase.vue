<script>
export default {
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
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
      this.$nextTick(() => {
        this.fetch()
      })
    },
    start(newVal, oldVal) {
      this.$nextTick(() => {
        this.fetch()
      })
    },
    end(newVal, oldVal) {
      this.$nextTick(() => {
        this.fetch()
      })
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
          this[comp] = res[comp]
        })

        this.loading = false
      }
    }
  }
}
</script>
