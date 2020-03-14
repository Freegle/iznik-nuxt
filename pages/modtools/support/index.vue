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
        <div v-if="searchuser && searchuser.length">
          <ModSupportUser v-for="user in searchresults" :id="user.id" :key="user.id" :expand="expand" />
        </div>
      </div>
    </div>
    <NoticeMessage v-else variant="warning">
      You don't have access to Support Tools.
    </NoticeMessage>
  </div>
</template>
<script>
import ModSupportUser from '../../../components/ModSupportUser'
import loginRequired from '@/mixins/loginRequired.js'
import NoticeMessage from '@/components/NoticeMessage'

export default {
  components: {
    ModSupportUser,
    NoticeMessage
  },
  layout: 'modtools',
  mixins: [loginRequired],
  data: function() {
    return {
      searching: false,
      searchuser: null
    }
  },
  computed: {
    searchresults() {
      const ret = this.$store.getters['user/list']
      return Object.values(ret)
    },
    expand() {
      return this.searchresults.length === 1
    }
  },
  mounted() {
    // Clear the user cache to make sure we don't display any results before we've searched.
    this.$store.dispatch('user/clear')
  },
  methods: {
    async usersearch() {
      this.searching = true

      await this.$store.dispatch('user/clear')

      await this.$store.dispatch('user/fetch', {
        search: this.searchuser,
        emailhistory: true
      })

      this.searching = false
    }
  }
}
</script>
