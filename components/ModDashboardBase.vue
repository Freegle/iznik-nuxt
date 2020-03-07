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
      this.fetch()
    },
    start(newVal, oldVal) {
      this.fetch()
    },
    end(newVal, oldVal) {
      this.fetch()
    }
  },
  mounted() {
    console.log('mounted')
    this.fetch()
  },
  methods: {
    async fetch() {
      console.log('Consider fetch', this.askfor, this.start, this.end)

      if (this.askfor && this.start && this.end) {
        console.log('do fetch')
        this.loading = true
        const res = await this.$api.dashboard.fetch({
          components: this.askfor,
          start: this.start.toISOString(),
          end: this.end.toISOString(),
          allgroups: !this.groupid,
          group: this.groupid
        })

        console.log('returned', res)
        Object.keys(res).forEach(comp => {
          console.log('Set', comp, res[comp])
          this[comp] = res[comp]
        })

        this.loading = false
      }
    }
  }
}
</script>
