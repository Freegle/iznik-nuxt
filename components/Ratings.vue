<template>
  <client-only>
    <span class="d-inline">
      <span v-if="user">
        <span v-if="showName">
          {{ user.displayname }}
        </span>
        <b-btn
          v-b-tooltip.hover.top
          :size="size"
          :variant="user.info.ratings.Mine === 'Up' ? 'primary' : (user.info.ratings.Up > 0 ? 'success' : 'white')"
          :title="user.info.ratings.Up + ' freegler' + ((user.info.ratings.Up !== 1) ? 's' : '') + '  gave them a thumbs up.  Click to rate.'"
          :disabled="(user.id === myid ? 'true' : undefined)"
          @click="up"
        >
          <v-icon name="thumbs-up" />&nbsp;{{ user.info.ratings.Up }}
        </b-btn>
        <b-btn
          v-b-tooltip.hover.top
          :size="size"
          :variant="user.info.ratings.Mine === 'Down' ? 'primary' : (user.info.ratings.Down > 0 ? 'warning' : 'white')"
          :title="user.info.ratings.Down + ' freegler' + ((user.info.ratings.Down !== 1) ? 's' : '') + '  gave them a thumbs down.  Click to rate.'"
          :disabled="user.id === myid ? 'true' : undefined"
          @click="down"
        >
          <v-icon name="thumbs-down" />&nbsp;{{ user.info.ratings.Down }}
        </b-btn>
      </span>
      <span v-else>
        <b-btn variant="white" title="No ratings yet.  Click to rate." @click="up">
          <v-icon name="thumbs-up" />&nbsp;0
        </b-btn>
        <b-btn variant="white" title="No ratings yet.  Click to rate." @click="down">
          <v-icon name="thumbs-down" />&nbsp;0
        </b-btn>
      </span>
    </span>
  </client-only>
</template>
<script>
// TODO DESIGN Showing that you have given feedback using blue is not very clear.  How can we improve that given limited space?
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
    },
    disabled: {
      type: String,
      required: false,
      default: ''
    },
    showName: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {}
  },
  computed: {
    myid() {
      const me = this.$store.getters['auth/user']
      return me ? me.id : null
    },
    user() {
      const ret = this.id ? this.$store.getters['user/get'](this.id) : null
      return ret
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    const user = this.$store.getters['user/get'](this.id)

    if (!user || !user.info) {
      // Not in the store yet - fetch.
      await this.$store.dispatch('user/fetch', {
        id: this.id,
        info: true
      })
    }
  },
  methods: {
    async rate(rating) {
      await this.$store.dispatch('user/rate', {
        id: this.id,
        rating: rating
      })
    },

    async up() {
      await this.rate('Up')
    },

    async down() {
      await this.rate('Down')
    }
  }
}
</script>
