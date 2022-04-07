<template>
  <div v-b-visible="visible">
    <b-card no-body>
      <b-card-header :header-bg-variant="rating.reviewrequired ? 'warning' : 'default'" class="d-flex justify-content-between flex-wrap">
        <div>
          <!-- eslint-disable-next-line-->
          <nuxt-link :to="'/modtools/members/approved/search/' + rating.groupid + '/' + rating.rater"><strong>{{ rating.raterdisplayname }}</strong> (<v-icon name="hashtag" class="text-muted" scale="0.75" />{{ rating.ratee }})</nuxt-link>
          <span v-if="rating.rating === 'Down'" class="text-danger font-weight-bold">gave a thumbs down to</span>
          <span v-else-if="rating.rating === 'Up'" class="text-success font-weight-bold">gave a thumbs up to</span>
          <!-- eslint-disable-next-line-->
          <nuxt-link :to="'/modtools/members/approved/search/' + rating.groupid + '/' + rating.ratee"><strong>{{ rating.rateedisplayname }}</strong> (<v-icon name="hashtag" class="text-muted" scale="0.75" />{{ rating.ratee }})</nuxt-link>
        </div>
        <div>
          {{ timeago(rating.timestamp) }},
          <span v-if="groupName">
            both members of {{ groupName }}
          </span>
          <span v-if="rating.reviewrequired" class="text-danger font-weight-bold">
            New
          </span>
        </div>
      </b-card-header>
      <b-card-body>
        <p v-if="rating.text" class="text-danger">
          <strong>{{ rating.reason }}</strong>: &quot;{{ rating.text }}&quot;
        </p>
        <div class="d-flex flex-wrap justify-content-between">
          <ChatButton
            :userid="rating.rater"
            :groupid="rating.groupid"
            :title="'Chat to ' + rating.raterdisplayname"
            variant="white"
          />
          <ChatButton
            :userid="rating.ratee"
            :groupid="rating.groupid"
            :title="'Chat to ' + rating.rateedisplayname"
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
    groupName() {
      let ret = null

      if (this.rater) {
        this.rater.memberof.forEach(g => {
          if (g.id === this.rating.groupid && this.amAModOn(g.id)) {
            ret = g.namedisplay
          }
        })
      }

      return ret
    }
  },
  methods: {
    visible(val) {
      if (val && this.rating.reviewrequired) {
        // Mark this as reviewed.  They've had a chance to see it.
        this.$store.dispatch('user/ratingReviewed', {
          id: this.rating.id
        })
      }
    }
  }
}
</script>
