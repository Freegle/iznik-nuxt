<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block">
        <sidebar-left />
      </b-col>
      <b-col cols="12" md="6" class="p-0">
        <div>
          <b-alert show variant="info" class="mt-2">
            <b-row>
              <b-col>
                <groupSelect id="mygroups" class="float-left" all @change="groupChange" />
              </b-col>
              <b-col>
                <b-form-select v-model="selectedType" class="float-right" value="All" :options="typeOptions" @change="typeChange" />
              </b-col>
            </b-row>
          </b-alert>
          <groupHeader v-if="group" :key="'groupheader-' + groupid" v-bind="group" />

          <div v-for="(message, $index) in messages" :key="'messagelist-' + $index" class="p-0">
            <message v-if="selectedType === 'All' || message.type == selectedType" v-bind="message" />
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
        <sidebar-right />
      </b-col>
    </b-row>
  </b-col>
</template>

<style scoped>
</style>

<script>
import loginRequired from '@/mixins/loginRequired.js'
const GroupSelect = () => import('~/components/GroupSelect.vue')
const GroupHeader = () => import('~/components/GroupHeader.vue')
const Message = () => import('~/components/Message.vue')
const SidebarLeft = () => import('~/components/sidebar-left.vue')
const SidebarRight = () => import('~/components/sidebar-right.vue')

export default {
  components: {
    GroupHeader,
    GroupSelect,
    Message,
    SidebarLeft,
    SidebarRight
  },
  mixins: [loginRequired],
  data: function() {
    return {
      id: null,
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
      // We remember any previously selected group.
      const remembered = this.$store.getters['group/remembered']('mygroups')
      const ret = remembered
        ? this.$store.getters['group/get'](remembered)
        : null

      return ret
    },

    messageCount: function() {
      const count = this.messages ? this.messages.length : 0
      return count
    },

    groupid: function() {
      const remembered = this.$store.getters['group/remembered']('mygroups')
      return remembered
    }
  },
  watch: {
    async group(newValue, oldValue) {
      // We have this watch because we may need to fetch a group that we have remembered.  The mounted()
      // call may happen before we have restored the persisted state, so we can't initiate the fetch there.
      //
      // TODO But this seems very ugly.  Is it right?
      const remembered = this.$store.getters['group/remembered']('mygroups')
      if (oldValue === null || oldValue.id !== remembered) {
        await this.$store.dispatch('group/fetch', {
          id: remembered
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
    groupChange: function() {
      this.messages = []
      this.context = null
      this.$store.dispatch('messages/clear')
    },

    typeChange: function() {
      this.infiniteId++
    },

    loadMore: function($state) {
      this.busy = true
      console.log('Load more')

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

      const remembered = this.$store.getters['group/remembered']('mygroups')

      this.$store
        .dispatch('messages/fetchMessages', {
          groupid: remembered,
          collection: 'Approved',
          summary: true,
          types: types,
          context: this.context
        })
        .then(() => {
          this.busy = false

          let messages

          if (remembered) {
            messages = this.$store.getters['messages/getByGroup'](remembered)
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
