<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block">
        <SidebarLeft :show-community-events="true" :show-bot-left="true" />
      </b-col>
      <b-col cols="12" lg="6" class="p-0">
        <JobsTopBar />
        <div>
          <div class="d-flex mt-2 mb-3 selection__wrapper justify-content-between">
            <GroupSelect v-model="groupid" class="m-3" all />
            <b-form-select v-model="selectedType" class="m-3 typeSelect" value="All" :options="typeOptions" @change="typeChange" />
          </div>
          <groupHeader v-if="group" :key="'groupheader-' + groupid" :group="group" :show-join="true" />
          <div v-for="message in filteredMessages" :key="'messagelist-' + message.id" class="p-0">
            <message v-if="(selectedType === 'All' || message.type == selectedType) && (!message.outcomes || message.outcomes.length === 0)" v-bind="message" />
          </div>

          <client-only>
            <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper=".pageContent" :distance="distance" @infinite="loadMore">
              <span slot="no-results" />
              <span slot="no-more" />
              <span slot="spinner">
                <b-img-lazy src="~/static/loader.gif" alt="Loading" />
              </span>
            </infinite-loading>
          </client-only>
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block">
        <sidebar-right show-volunteer-opportunities />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import GroupSelect from '../../components/GroupSelect'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import createGroupRoute from '@/mixins/createGroupRoute'
const JobsTopBar = () => import('~/components/JobsTopBar')
const GroupHeader = () => import('~/components/GroupHeader.vue')
const Message = () => import('~/components/Message.vue')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')

export default {
  components: {
    GroupSelect,
    InfiniteLoading,
    JobsTopBar,
    GroupHeader,
    Message,
    SidebarLeft,
    SidebarRight
  },
  mixins: [loginRequired, buildHead, createGroupRoute('communities')],
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
    }
  },
  watch: {
    groupid() {
      this.context = null
      this.$store.dispatch('messages/clear')
    },
    async group(newValue, oldValue) {
      // We have this watch because we may need to fetch a group that we have remembered.  The mounted()
      // call may happen before we have restored the persisted state, so we can't initiate the fetch there.
      if (oldValue === null || oldValue.id !== this.groupid) {
        await this.$store.dispatch('group/fetch', {
          id: this.groupid
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
        id: this.groupid
      })
    }
  },
  methods: {
    typeChange: function() {
      this.infiniteId++
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
          $state.complete()
          console.log('Complete on error', e)
        })
    }
  },

  head() {
    return this.buildHead(
      'Communities',
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
</style>
