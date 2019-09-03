<template>
  <client-only>
    <span class="b-inline">
      <span v-if="user">
        <b-btn v-b-tooltip.hover.top :size="size" :variant="user.info.ratings.Mine === 'Up' ? 'primary' : (user.info.ratings.Up > 0 ? 'success' : 'white')" :title="user.info.ratings.Up + ' freegler' + ((user.info.ratings.Up !== 1) ? 's' : '') + '  gave them a thumbs up.  Click to rate.'" @click="up">
          <v-icon name="thumbs-up" />&nbsp;{{ user.info.ratings.Up }}
        </b-btn>
        <b-btn v-b-tooltip.hover.top :size="size" :variant="user.info.ratings.Mine === 'Down' ? 'primary' : (user.info.ratings.Down > 0 ? 'warning' : 'white')" :title="user.info.ratings.Down + ' freegler' + ((user.info.ratings.Down !== 1) ? 's' : '') + '  gave them a thumbs down.  Click to rate.'" @click="down">
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
  methods: {
    up() {
      this.$store.dispatch('user/rate', {
        id: this.id,
        rating: 'Up'
      })

      // Handle the calculation on the client rather than wait for the server - make it look zippy.
      if (this.user.info.ratings.Mine !== 'Up') {
        if (this.user.info.ratings.Mine === 'Down') {
          this.user.info.ratings.Down--
        }

        this.user.info.ratings.Up++
        this.user.info.ratings.Mine = 'Up'
      }
    },

    down() {
      this.$store.dispatch('user/rate', {
        id: this.id,
        rating: 'Down'
      })

      if (this.user.info.ratings.Mine !== 'Down') {
        if (this.user.info.ratings.Mine === 'Up') {
          this.user.info.ratings.Up--
        }

        this.user.info.ratings.Down++
        this.user.info.ratings.Mine = 'Down'
      }
    }
  }
}
</script>
