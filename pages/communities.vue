<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block">
        <sidebar-left />
      </b-col>
      <b-col cols="12" md="6" class="p-0">
        <div>
          <div class="d-flex mt-2 mb-3 notification">
            <GroupRememberSelect v-model="groupid" remember="mygroups" class="m-3" all />
            <b-form-select v-model="selectedType" class="m-3" value="All" :options="typeOptions" @change="typeChange" />
          </div>
          <groupHeader v-if="group" :key="'groupheader-' + groupid" v-bind="group" />
          <div v-for="message in messages" :key="'messagelist-' + message.id" class="p-0">
            <message v-if="(selectedType === 'All' || message.type == selectedType) && (!message.outcomes || message.outcomes.length === 0)" v-bind="message" />
          </div>

          <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" />
            </span>
          </infinite-loading>
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block">
        <sidebar-right show-volunteer-opportunities show-job-opportunities />
      </b-col>
    </b-row>
  </b-col>
</template>

<style scoped lang="scss">
@import 'color-vars';

.notification {
  background-color: $color-blue--x-light;
  border: 1px solid $color-blue-x-light2;
  border-radius: 3px;
}
</style>

<script>
import loginRequired from '@/mixins/loginRequired.js'
const GroupRememberSelect = () => import('~/components/GroupRememberSelect.vue')
const GroupHeader = () => import('~/components/GroupHeader.vue')
const Message = () => import('~/components/Message.vue')
const SidebarLeft = () => import('~/components/SidebarLeft')
const SidebarRight = () => import('~/components/SidebarRight')

export default {
  components: {
    GroupHeader,
    GroupRememberSelect,
    Message,
    SidebarLeft,
    SidebarRight
  },
  mixins: [loginRequired],
  data: function() {
    return {
      id: null,
      groupid: 0,
      messages: [],
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
    }
  },
  watch: {
    groupid() {
      this.messages = []
      this.context = null
      this.$store.dispatch('messages/clear')
    },
    async group(newValue, oldValue) {
      // We have this watch because we may need to fetch a group that we have remembered.  The mounted()
      // call may happen before we have restored the persisted state, so we can't initiate the fetch there.
      //
      // TODO But this seems very ugly.  Is it right?
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
  },
  methods: {
    typeChange: function() {
      this.infiniteId++
    },

    loadMore: function($state) {
      this.busy = true
      console.log('Load more', this.groupid)

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

          let messages

          if (this.groupid) {
            messages = this.$store.getters['messages/getByGroup'](this.groupid)
          } else {
            messages = this.$store.getters['messages/getAll']()
          }

          this.messages = messages
          this.context = this.$store.getters['messages/getContext']()

          if (currentCount === messages.length) {
            this.complete = true
            $state.complete()
            console.log('Complete')
          } else {
            console.log('Loaded')
            $state.loaded()
          }
        })
        .catch(e => {
          this.busy = false
          $state.complete()
          console.log('Complete on error', e)
        })
    }
  }
}
</script>
