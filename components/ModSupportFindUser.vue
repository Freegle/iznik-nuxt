<template>
  <div>
    <b-input-group class="mb-2">
      <b-form-input
        v-model="searchuser"
        placeholder="Email, numerical id, or ~- encoded id"
        class="max"
        :disabled="searching"
        autocapitalize="none"
        autocomplete="off"
        @keyup="searched = false"
        @keyup.enter.exact="usersearch"
      />
      <b-input-group-append>
        <b-button variant="primary" @click="usersearch">
          <v-icon v-if="searching" name="sync" class="fa-spin" />
          <v-icon v-else name="search" /> Find user
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <div v-if="!searching && searchuser && searched">
      <ModSupportUser v-for="user in visible" :id="user.id" :key="user.id" :expand="expand" />
      <infinite-loading key="infiniteusers" @infinite="loadMoreUsers">
        <div slot="no-results">
          <p class="text-left">
            No users found.
          </p>
        </div>
        <span slot="no-more" />
        <span slot="spinner" />
      </infinite-loading>
    </div>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ModSupportUser from './ModSupportUser'

export default {
  components: {
    ModSupportUser,
    InfiniteLoading
  },
  props: {
    id: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      searching: false,
      searchuser: null,
      show: 0,
      searched: false,
      searchresults: []
    }
  },
  computed: {
    expand() {
      return this.searchresults.length === 1
    },
    visible() {
      return this.searchresults && this.searchresults.length
        ? this.searchresults.slice(0, this.show)
        : []
    }
  },
  mounted() {
    // Clear the user cache to make sure we don't display any results before we've searched.
    this.$store.dispatch('user/clear')

    if (this.id) {
      this.searchuser = this.id
      this.usersearch()
    }
  },
  methods: {
    async usersearch() {
      const val = this.searchuser.trim()

      if (val) {
        this.searching = true

        this.show = 0

        await this.$store.dispatch('user/clear')

        await this.$store.dispatch('user/fetch', {
          search: encodeURIComponent(val),
          emailhistory: true
        })

        this.searching = false
        this.searched = true

        // Get a copy of the results here.  The store might change later if we view a chat and have to fetch another
        // user.  That can cause us to get confused.
        const ret = this.$store.getters['user/list']

        // Show most recent first
        this.searchresults = Object.values(ret).sort((a, b) => {
          return (
            new Date(b.lastaccess).getTime() - new Date(a.lastaccess).getTime()
          )
        })
      }
    },
    loadMoreUsers: function($state) {
      // We use an infinite scroll on the list of chats because even though we have all the data in hand, the less
      // we render onscreen the faster vue is to do so.
      this.show++

      if (this.show > this.searchresults.length) {
        this.show = this.searchresults.length
        $state.complete()
        this.complete = true
      } else {
        $state.loaded()
      }
    }
  }
}
</script>
<style scoped>
.max {
  max-width: 300px;
}
</style>
