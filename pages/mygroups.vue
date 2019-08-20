<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3">
        Community Events go here
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

          <infinite-loading :key="'infinite-' + groupid" :identifier="infiniteId" force-use-infinite-wrapper="body" @infinite="loadMore">
            <span slot="spinner">
              <span slot="no-results" />
              <span slot="no-more" />
              <b-img-lazy src="~/static/loader.gif" />
            </span>
          </infinite-loading>
        </div>
      </b-col>
      <b-col cols="0" md="3">
        Volunteer ops and ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style scoped>
</style>
<script>
import GroupSelect from '~/components/GroupSelect.vue'
import GroupHeader from '~/components/GroupHeader.vue'
import Message from '~/components/Message.vue'

export default {
  components: {
    GroupHeader,
    GroupSelect,
    Message
  },
  data() {
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
      infiniteId: +new Date()
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
      return this.group ? this.group.id : null
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
  },
  methods: {
    groupChange: function() {
      this.messages = []
      this.context = null
    },

    typeChange: function() {
      this.infiniteId++
    },

    loadMore: function($state) {
      console.log('Load more')
      this.busy = true

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
          groupid: this.group ? this.group.id : null,
          collection: 'Approved',
          summary: true,
          types: types,
          context: this.context
        })
        .then(() => {
          this.busy = false

          if (this.group) {
            this.messages = this.$store.getters['messages/getByGroup'](
              this.group.id
            )
          } else {
            this.messages = this.$store.getters['messages/getAll']()
          }

          this.context = this.$store.getters['messages/getContext']()
          $state.loaded()
          console.log('Loaded')
        })
        .catch(() => {
          this.busy = false
          $state.complete()
          console.log('Complete')
        })
    }
  }
}
</script>
