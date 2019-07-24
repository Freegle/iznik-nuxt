<template>
  <no-ssr>
    <span class="b-inline">
      <span v-if="user">
        <b-btn :variant="user.info.ratings.Up > 0 ? 'success' : 'white'">
          <fa icon="thumbs-up" />&nbsp;{{ user.info.ratings.Up }}
        </b-btn>
        <b-btn :variant="user.info.ratings.Down > 0 ? 'warning' : 'white'">
          <fa icon="thumbs-down" />&nbsp;{{ user.info.ratings.Down }}
        </b-btn>
      </span>
      <span v-else>
        <b-btn variant="success" disabled>
          <fa icon="thumbs-up" />&nbsp;?
        </b-btn>
        <b-btn variant="warning" disabled>
          <fa icon="thumbs-down" />&nbsp;?
        </b-btn>
      </span>
    </span>
  </no-ssr>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      user: null
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('user/fetch', {
      id: this.id,
      info: true
    })

    this.user = this.$store.getters['user/get'](this.id)
  },
  methods: {}
}
</script>
