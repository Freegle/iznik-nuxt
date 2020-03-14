<template>
  <div>
    <div v-if="supportOrAdmin">
      <div>
        <h2>Find User</h2>
        <b-row>
          <b-col cols="12" md="6">
            <b-input-group class="mb-2">
              <b-form-input
                v-model="searchuser"
                placeholder="Email, numerical id, or ~- encoded id"
                @keyup.enter.exact="usersearch"
              />
              <b-input-group-append>
                <b-button variant="success" @click="usersearch">
                  <v-icon v-if="searching" name="sync" class="fa-spin" />
                  <v-icon v-else name="search" /> Find user
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <ModSupportUser v-for="user in visible" :id="user.id" :key="user.id" :expand="expand" />
        <infinite-loading v-if="searchresults.length" key="infiniteusers" @infinite="loadMoreUsers">
          <span slot="no-results">
            <notice-message v-if="!searchresults">
              No users found.
            </notice-message>
          </span>
          <span slot="no-more" />
          <span slot="spinner" />
        </infinite-loading>
      </div>
    </div>
    <NoticeMessage v-else variant="warning">
      You don't have access to Support Tools.
    </NoticeMessage>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ModSupportUser from '../../../components/ModSupportUser'
import loginRequired from '@/mixins/loginRequired.js'
import NoticeMessage from '@/components/NoticeMessage'

export default {
  components: {
    ModSupportUser,
    NoticeMessage,
    InfiniteLoading
  },
  layout: 'modtools',
  mixins: [loginRequired],
  data: function() {
    return {
      searching: false,
      searchuser: null,
      show: 0
    }
  },
  computed: {
    searchresults() {
      const ret = this.$store.getters['user/list']

      // Show most recent first
      return Object.values(ret).sort((a, b) => {
        return (
          new Date(b.lastaccess).getTime() - new Date(a.lastaccess).getTime()
        )
      })
    },
    expand() {
      return this.searchresults.length === 1
    },
    visible() {
      console.log('Compute visible', this.searchresults, this.show)
      return this.searchresults && this.searchresults.length
        ? this.searchresults.slice(0, this.show)
        : []
    }
  },
  mounted() {
    // Clear the user cache to make sure we don't display any results before we've searched.
    this.$store.dispatch('user/clear')
  },
  methods: {
    async usersearch() {
      this.searching = true

      this.show = 0

      await this.$store.dispatch('user/clear')

      await this.$store.dispatch('user/fetch', {
        search: this.searchuser,
        emailhistory: true
      })

      this.searching = false
    },
    loadMoreUsers: function($state) {
      // We use an infinite scroll on the list of chats because even though we have all the data in hand, the less
      // we render onscreen the faster vue is to do so.
      this.show++
      console.log('Load more', this.show)

      if (this.show > this.searchresults.length) {
        this.showChats = this.searchresults.length
        $state.complete()
        this.complete = true
      } else {
        $state.loaded()
      }
    }
  }
}
</script>
