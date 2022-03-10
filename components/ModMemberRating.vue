<template>
  <div v-b-visible="visible">
    <b-card v-if="rater && ratee" no-body>
      <b-card-header :header-bg-variant="rating.reviewrequired ? 'warning' : 'default'">
        <!-- eslint-disable-next-line-->
        <nuxt-link :to="'/modtools/members/approved/search/' + rating.groupid + '/' + rater.id"><strong>{{ rater.displayname }}</strong> (<v-icon name="hashtag" class="text-muted" scale="0.75" />{{ rater.id }})</nuxt-link>
        <span class="text-muted">gave a thumbs down to</span>
        <!-- eslint-disable-next-line-->
        <nuxt-link :to="'/modtools/members/approved/search/' + rating.groupid + '/' + ratee.id"><strong>{{ ratee.displayname }}</strong> (<v-icon name="hashtag" class="text-muted" scale="0.75" />{{ ratee.id }})</nuxt-link>
        <div>
          {{ timeago(rating.timestamp) }}
          <span v-if="!rating.reviewrequired">
            reviewed
          </span>
          <span v-else class="text-danger font-weight-bold">
            new
          </span>
          <span v-if="groupName">
            both on {{ groupName }}
          </span>
        </div>
      </b-card-header>
      <b-card-body>
        <p>
          <strong>{{ rating.reason }}</strong>: &quot;{{ rating.text }}&quot;
        </p>
        <div class="d-flex flex-wrap justify-content-between">
          <ChatButton
            :userid="rater.id"
            :groupid="rater.groupid"
            :title="'Chat to ' + rater.displayname"
            variant="white"
          />
          <ChatButton
            :userid="ratee.id"
            :groupid="ratee.groupid"
            :title="'Chat to ' + ratee.displayname"
            variant="white"
          />
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import ChatButton from './ChatButton'

export default {
  components: { ChatButton },
  props: {
    rating: {
      type: Object,
      required: true
    }
  },
  computed: {
    rater() {
      return this.$store.getters['user/get'](this.rating.rater)
    },
    ratee() {
      return this.$store.getters['user/get'](this.rating.ratee)
    },
    groupName() {
      let ret = null

      if (this.rater) {
        this.rater.memberof.forEach(g => {
          if ((g.id = this.rating.groupid)) {
            ret = g.namedisplay
          }
        })
      }

      return ret
    }
  },
  mounted() {
    this.$store.dispatch('user/fetch', {
      id: this.rating.rater,
      info: true
    })

    this.$store.dispatch('user/fetch', {
      id: this.rating.ratee,
      info: true
    })
  },
  methods: {
    visible(val) {
      if (val && this.rating.reviewrequired) {
        // Mark this as reviewed.  They've had a chance to see it.
        this.$store.dispatch('members/ratingReviewed', {
          id: this.rating.id
        })
      }
    }
  }
}
</script>
