<template>
  <client-only>
    <span class="d-inline">
      <span v-if="user && user.info">
        <span v-if="showName">
          {{ user.displayname }}
        </span>
        <b-btn
          v-b-tooltip.hover.top
          :size="size"
          :variant="user.info.ratings.Mine === 'Up' ? 'primary' : (user.info.ratings.Up > 0 ? 'success' : 'white')"
          :title="uptitle"
          :disabled="((disabled || user.id === myid) ? 'true' : undefined)"
          @click="up"
        >
          <v-icon name="thumbs-up" />&nbsp;{{ user.info.ratings.Up }}
        </b-btn>
        <b-btn
          v-b-tooltip.hover.top
          :size="size"
          :variant="user.info.ratings.Mine === 'Down' ? 'primary' : (user.info.ratings.Down > 0 ? 'warning' : 'white')"
          :title="downtitle"
          :disabled="(disabled || user.id === myid) ? 'true' : undefined"
          @click="down"
        >
          <v-icon name="thumbs-down" />&nbsp;{{ user.info.ratings.Down }}
        </b-btn>
      </span>
      <span v-else-if="user">
        <b-btn
          variant="white"
          title="No ratings yet.  Click to rate."
          :disabled="(disabled || user.id === myid) ? 'true' : undefined"
          @click="up"
        >
          <v-icon name="thumbs-up" />&nbsp;0
        </b-btn>
        <b-btn
          variant="white"
          title="No ratings yet.  Click to rate."
          :disabled="(disabled || user.id === myid) ? 'true' : undefined"
          @click="down"
        >
          <v-icon name="thumbs-down" />&nbsp;0
        </b-btn>
      </span>
    </span>
  </client-only>
</template>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'

Vue.use(TooltipPlugin)

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
      type: Boolean,
      required: false,
      default: false
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
    user() {
      const ret = this.id ? this.$store.getters['user/get'](this.id) : null
      return ret
    },
    uptitle() {
      if (this.user.info.ratings.Mine === 'Up') {
        return 'You gave them a thumbs up.  Click to undo.'
      } else {
        return (
          this.user.info.ratings.Up +
          ' freegler' +
          (this.user.info.ratings.Up !== 1 ? 's' : '') +
          '  gave them a thumbs up.  Click to rate, click again to undo.'
        )
      }
    },
    downtitle() {
      if (this.user.info.ratings.Mine === 'Down') {
        return 'You gave them a thumbs down.  Click to undo.'
      } else {
        return (
          this.user.info.ratings.Down +
          ' freegler' +
          (this.user.info.ratings.Down !== 1 ? 's' : '') +
          '  gave them a thumbs Down.  Click to rate, click again to undo.'
        )
      }
    }
  },
  mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    if (this.id) {
      const user = this.$store.getters['user/get'](this.id)

      if (!user || !user.info) {
        // Not in the store yet - fetch.
        console.log('Ratings need to fetch user', this.id)
        this.$store.dispatch('user/fetch', {
          id: this.id,
          info: true
        })
      }
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
      if (this.user.info.ratings.Mine === 'Up') {
        await this.rate(null)
      } else {
        await this.rate('Up')
      }
    },

    async down() {
      if (this.user.info.ratings.Mine === 'Down') {
        await this.rate(null)
      } else {
        await this.rate('Down')
      }
    }
  }
}
</script>
