<template>
  <no-ssr>
    <span class="b-inline">
      <span v-if="user">
        <b-btn v-b-tooltip.hover.top :size="size" :variant="user.info.ratings.Mine === 'Up' ? 'primary' : (user.info.ratings.Up > 0 ? 'success' : 'white')" :title="user.info.ratings.Up + ' freegler' + ((user.info.ratings.Up !== 1) ? 's' : '') + '  gave them a thumbs up.  Click to rate.'">
          <fa icon="thumbs-up" />&nbsp;{{ user.info.ratings.Up }}
        </b-btn>
        <b-btn v-b-tooltip.hover.top :size="size" :variant="user.info.ratings.Mine === 'Down' ? 'primary' : (user.info.ratings.Down > 0 ? 'warning' : 'white')" :title="user.info.ratings.Down + ' freegler' + ((user.info.ratings.Down !== 1) ? 's' : '') + '  gave them a thumbs down.  Click to rate.'">
          <fa icon="thumbs-down" />&nbsp;{{ user.info.ratings.Down }}
        </b-btn>
      </span>
      <span v-else>
        <b-btn variant="white">
          <fa icon="thumbs-up" />&nbsp;0
        </b-btn>
        <b-btn variant="white">
          <fa icon="thumbs-down" />&nbsp;0
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
      required: false,
      default: null
    },
    size: {
      type: String,
      required: false,
      default: 'md'
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
