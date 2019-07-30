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
        <div v-if="!busy">
          <b-row class="text-center">
            <b-col>
              <b-btn variant="white" class="text-center" @click="loadMore">
                Load more (TODO infinite scroll not working properly)
              </b-btn>
            </b-col>
          </b-row>
        </div>
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
      users: [],
      busy: false
    }
  },

  computed: {},

  created() {
    this.id = this.$route.params.id
  },

  methods: {
    async loadMore($state) {
      // TODO Infinite scroll playing up here, which is why we have the Load More button.  Debug and fix.
      this.busy = true

      console.log('Load more')
      if (!this.$store.$auth.state.loggedIn) {
        console.log('Not logged in')

        if ($state.complete) {
          $state.complete()
        }
      } else {
        try {
          const context = this.$store.getters['newsfeed/getContext']()
          await this.$store.dispatch('newsfeed/fetchFeed', {
            context: context
          })

          this.newsfeed = this.$store.getters['newsfeed/newsfeed']()
          this.users = this.$store.getters['newsfeed/users']()
          // TODO Handle ID case

          if ($state.loaded) {
            $state.loaded()
          }
        } catch (e) {
          console.log('Load failed', e)

          if ($state.complete) {
            $state.complete()
          }
        }

        this.busy = false
      }
    }
  }
}
</script>
