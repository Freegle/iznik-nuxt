<template>
  <div v-b-visible="visible">
    <b-card no-body>
      <b-card-header :header-bg-variant="variant">
        <b-row>
          <b-col cols="2" class="text-center">
            <v-icon :name="icon" scale="2" />
          </b-col>
          <b-col cols="6">
            <v-icon name="hashtag" scale="0.75" />{{ member.user.id }}
            <span v-if="member.user.email">
              ({{ member.user.email }})
            </span>
          </b-col>
          <b-col cols="4">
            {{ member.timestamp | timeago }}
            <span v-if="member.reviewed">
              reviewed
            </span>
            <span v-else class="text-warning">
              new
            </span>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="2" class="text-center">
            <v-icon :name="outcomeIcon" /> {{ member.outcome }}
          </b-col>
          <b-col cols="6">
            {{ member.message.subject }}
          </b-col>
          <b-col cols="4">
            <b-btn :to="'/modtools/members/approved/search/' + member.groupid + '/' + member.user.id" variant="link" class="text-white p-0">
              <v-icon name="hashtag" scale="0.75" />{{ member.message.id }}
              <span v-if="groupname">
                on {{ groupname }}
              </span>
            </b-btn>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body>
        <div class="d-flex justify-content-between flex-wrap">
          {{ member.comments }}&nbsp;
          <ChatButton
            :userid="member.user.id"
            :groupid="member.groupid"
            title="Chat"
            variant="white"
          />
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import Vue from 'vue'
import { VBVisiblePlugin } from 'bootstrap-vue'
import ChatButton from './ChatButton'

Vue.use(VBVisiblePlugin)

export default {
  components: { ChatButton },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    member() {
      return this.$store.getters['members/get'](this.id)
    },
    variant() {
      switch (this.member.happiness) {
        case 'Happy':
          return 'success'
        case 'Unhappy':
          return 'warning'
        default:
          return 'light'
      }
    },
    icon() {
      switch (this.member.happiness) {
        case 'Happy':
          return 'smile'
        case 'Unhappy':
          return 'frown'
        default:
          return 'meh'
      }
    },
    outcomeIcon() {
      switch (this.member.outcome) {
        case 'Taken':
        case 'Received':
          return 'check'
        default:
          return 'times'
      }
    },
    groupname() {
      let ret = null
      const group = this.$store.getters['auth/groupById'](this.member.groupid)

      if (group) {
        ret = group.namedisplay
      }

      return ret
    }
  },
  mounted() {},
  methods: {
    visible(val) {
      if (val && !this.member.reviewed) {
        // Mark this as reviewed.  They've had a chance to see it.
        this.$store.dispatch('members/happinessReviewed', {
          userid: this.member.user.id,
          groupid: this.member.groupid,
          happinessid: this.member.id
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.card-header.bg-success {
  background-color: $colour-success-fg !important;
  color: white !important;
}
</style>
