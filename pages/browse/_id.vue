<template>
  <b-container fluid>
    <h1 class="sr-only">
      Browse items
    </h1>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1">
        <SidebarLeft :show-community-events="true" :show-bot-left="true" />
      </b-col>
      <b-col cols="12" lg="6" class="p-0">
        <CovidWarning />
        <ExpectedRepliesWarning v-if="me && me.expectedreplies" :count="me.expectedreplies" :chats="me.expectedchats" />
        <Viewed v-if="!simple" class="mb-1" />
        <NearbyGroups v-if="!simple" class="mb-1" />
        <JobsTopBar />
        <div>
          <NoticeMessage v-if="!anyGroups" variant="primary" class="mt-2 text-center font-weight-bold">
            <p>You're not a member of any communities yet.  Why not explore to find one?</p>
            <div class="d-flex justify-content-around mb-2">
              <b-btn size="lg" variant="primary" to="/explore" class="mb-2">
                <v-icon name="map-marker-alt" /> Explore communities
              </b-btn>
            </div>
            <p>Or get freegling:</p>
            <b-row class="mt-2">
              <b-col class="half-pad-col-right" cols="6" md="5">
                <b-btn block variant="primary" class="float-left" size="lg" to="/give">
                  <v-icon name="gift" />&nbsp;Give Stuff
                </b-btn>
              </b-col>
              <b-col class="half-pad-col-left" offset="0" offset-md="2" cols="6" md="5">
                <b-btn block variant="secondary" class="float-right" size="lg" to="/find">
                  <v-icon name="shopping-cart" />&nbsp;Ask for Stuff
                </b-btn>
              </b-col>
            </b-row>
          </NoticeMessage>
          <div v-else>
            <div class="bg-white d-block d-xl-none">
              <div class="d-flex justify-content-between">
                <b-btn to="/give" variant="primary" class="topbutton ml-1 mr-1">
                  <v-icon name="gift" />
                  Give
                </b-btn>
                <b-btn to="/find" variant="primary" class="topbutton ml-1 mr-1">
                  <v-icon name="shopping-cart" />
                  Ask
                </b-btn>
                <b-btn to="/search" variant="secondary" class="topbutton ml-1 mr-1">
                  <v-icon name="search" />
                  Search
                </b-btn>
                <b-btn to="/explore" variant="secondary" class="topbutton ml-1 mr-1">
                  <v-icon name="map-marker-alt" />
                  Explore
                </b-btn>
              </div>
            </div>
            <div class="d-flex mt-2 mb-3 selection__wrapper justify-content-between">
              <GroupSelect v-model="groupid" class="m-3" all />
              <b-form-select v-model="selectedType" class="m-3 typeSelect" value="All" :options="typeOptions" @change="typeChange" />
            </div>
            <groupHeader v-if="group" :key="'groupheader-' + groupid" :group="group" :show-join="true" />
            <CovidClosed v-if="closed" />
            <div v-else>
              <h2 class="sr-only">
                List of wanteds and offers
              </h2>
              <div v-for="message in filteredMessages" :key="'messagelist-' + message.id" class="p-0">
                <message v-if="(selectedType === 'All' || message.type == selectedType) && (!message.outcomes || message.outcomes.length === 0)" v-bind="message" />
              </div>

              <client-only>
                <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
                  <span slot="no-results" />
                  <span slot="no-more" />
                  <span slot="spinner">
                    <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                  </span>
                </infinite-loading>
              </client-only>
            </div>
          </div>
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1">
        <sidebar-right show-volunteer-opportunities />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import GroupSelect from '../../components/GroupSelect'
import Viewed from '../../components/Viewed'
import CovidWarning from '../../components/CovidWarning'
import CovidClosed from '../../components/CovidClosed'
import NearbyGroups from '../../components/NearbyGroups'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import createGroupRoute from '@/mixins/createGroupRoute'
const JobsTopBar = () => import('~/components/JobsTopBar')
const GroupHeader = () => import('~/components/GroupHeader.vue')
const Message = () => import('~/components/Message.vue')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')
const ExpectedRepliesWarning = () =>
  import('~/components/ExpectedRepliesWarning')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    NearbyGroups,
    CovidClosed,
    CovidWarning,
    NoticeMessage,
    Viewed,
    GroupSelect,
    InfiniteLoading,
    JobsTopBar,
    GroupHeader,
    Message,
    SidebarLeft,
    SidebarRight,
    ExpectedRepliesWarning
  },
  mixins: [loginRequired, buildHead, createGroupRoute('browse')],
  data: function() {
    return {
      id: null,
      busy: false,
      context: null,
      typeOptions: [
        {
          value: 'All',
          text: 'All posts',
          selected: true
        },
        {
          value: 'Offer',
          text: 'Just OFFERs'
        },
        {
          value: 'Wanted',
          text: 'Just WANTEDs'
        }
      ],
      selectedType: 'All',
      infiniteId: +new Date(),
      distance: 1000
    }
  },
  computed: {
    group: function() {
      const ret = this.groupid
        ? this.$store.getters['group/get'](this.groupid)
        : null

      return ret
    },

    closed() {
      let ret = false

      if (this.group && this.group.settings && this.group.settings.closed) {
        ret = true
      }

      return ret
    },

    messageCount: function() {
      const count = this.messages ? this.messages.length : 0
      return count
    },

    messages: function() {
      let messages

      if (this.groupid) {
        messages = this.$store.getters['messages/getByGroup'](this.groupid)
      } else {
        messages = this.$store.getters['messages/getAll']
      }

      return messages
    },

    filteredMessages() {
      return this.messages.filter(message => {
        return !message.outcomes || message.outcomes.length === 0
      })
    },

    anyGroups() {
      const groups = this.$store.getters['auth/groups']

      return groups && groups.length
    }
  },
  watch: {
    groupid() {
      this.context = null
      this.$store.dispatch('messages/clear')
    },
    async group(newValue, oldValue) {
      // We need both this and the mounted version in case we change group.
      if (oldValue === null || oldValue.id !== this.groupid) {
        await this.$store.dispatch('group/fetch', {
          id: this.groupid,
          sponsors: true,
          showmods: true
        })
      }
    }
  },
  mounted() {
    // We want this to be our next home page.
    try {
      localStorage.setItem('Iznik>lasthomepage', 'mygroups')
    } catch (e) {
      console.log('Save last route failed', e)
    }

    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')

    // Get our list of groups
    this.$store.dispatch('auth/fetchUser', {
      components: ['me', 'groups']
    })

    if (process.client && this.groupid) {
      // Fetch this group for header info.
      this.$store.dispatch('group/fetch', {
        id: this.groupid,
        sponsors: true,
        showmods: true
      })
    }

    // We might have a preference for which type of posts we view.
    const postType = this.$store.getters['misc/get']('postType')
    if (postType) {
      this.selectedType = postType
    }
  },
  methods: {
    typeChange: function() {
      this.infiniteId++
      this.$store.dispatch('misc/set', {
        key: 'postType',
        value: this.selectedType
      })
    },

    loadMore: function($state) {
      this.busy = true

      const currentCount = this.messages.length

      let types = []

      switch (this.selectedType) {
        case 'All':
          types = ['Offer', 'Wanted']
          break
        case 'Offer':
          types = ['Offer']
          break
        case 'Wanted':
          types = ['Wanted']
          break
      }

      this.$store
        .dispatch('messages/fetchMessages', {
          groupid: this.groupid,
          collection: 'Approved',
          summary: true,
          types: types,
          context: this.context
        })
        .then(() => {
          this.busy = false

          this.context = this.$store.getters['messages/getContext']

          if (currentCount === this.messages.length) {
            this.complete = true
            $state.complete()
          } else {
            $state.loaded()
          }
        })
        .catch(e => {
          this.busy = false
          console.log('Complete on error', e)
          $state.complete()
        })
    }
  },

  head() {
    return this.buildHead(
      'Browse',
      "See the OFFERs and WANTEDs from communities you've joined"
    )
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.selection__wrapper {
  background-color: $color-blue--x-light;
  border: 1px solid $color-blue-x-light2;
  border-radius: 3px;
}

.typeSelect {
  max-width: 33%;
}

.topbutton {
  width: 40%;
}
</style>
