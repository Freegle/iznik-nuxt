<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="3">
        Community Events go here
      </b-col>
      <b-col cols="6" class="newsfeedHolder p-0" infinite-wrapper>
        <ul v-for="(entry, $index) in newsfeed" :key="'newsfeed-' + $index" class="p-0 pt-1 list-unstyled mb-1">
          <li>
            <newsThread :key="'newsfeed-' + entry.id" :newsfeed="entry" :users="users" />
          </li>
        </ul>
        <infinite-loading force-use-infinite-wrapper="true" @infinite="loadMore">
          <span slot="no-results" />
        </infinite-loading>
      </b-col>
      <b-col cols="3">
        Volunteer ops and ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style>
.newsfeedHolder {
  height: calc(100vh - 74px);
}
</style>
<script>
import newsThread from '~/components/newsThread.vue'

export default {
  components: {
    newsThread
  },

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  data() {
    return {
      id: null,
      newsfeed: null,
      users: []
    }
  },

  computed: {},

  created() {
    this.id = this.$route.params.id
  },

  methods: {
    async loadMore() {
      console.log('Load more')
      if (!this.$store.$auth.state.loggedIn) {
        console.log('Not logged in')
      } else {
        await this.$store.dispatch('newsfeed/fetchFeed')

        console.log('Store feed', this.$store.getters['newsfeed/newsfeed']())
        this.newsfeed = Object.values(
          this.$store.getters['newsfeed/newsfeed']()
        )
        this.users = this.$store.getters['newsfeed/users']()
        // TODO Handle ID case
        console.log('Fetched', this.newsfeed, this.users)
      }
    }
  }
}
</script>
