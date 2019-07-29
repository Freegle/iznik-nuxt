<template>
  <div class="bg-white">
    <b-card>
      <b-card-text>
        <b-row>
          <b-col cols="1">
            <div v-if="newsfeed.userid">
              From {{ newsfeed.userid }}
              {{ users[newsfeed.userid].displayname }}
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            {{ newsfeed.message }}
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import twem from '~/assets/js/twem'

export default {
  props: {
    newsfeed: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      required: true
    }
  },
  computed: {
    emessage() {
      return this.newsfeed.message
        ? twem.twem(this.$twemoji, this.newsfeed.message)
        : null
    }
  }
}
</script>
