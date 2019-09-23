<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" md="6" offset-md="3">
        <groupHeader v-if="group" :id="group.id" :key="'group-' + (group ? group.id : null)" v-bind="group" />
        <b-card variant="default">
          <b-card-body class="p-0 mb-2">
            <p class="text-center text-muted">
              Offer stuff you don't need, or find stuff you want.
            </p>
            <b-row>
              <b-col cols="5">
                <b-button to="/give" class="mt-1" size="lg" block variant="success">
                  <v-icon name="gift" />&nbsp;Give stuff
                </b-button>
              </b-col>
              <b-col cols="2" />
              <b-col cols="5">
                <b-button to="/find" class="mt-1" size="lg" block variant="primary">
                  <v-icon name="search" />&nbsp;Find stuff
                </b-button>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>

        <div v-for="(message, $index) in messages" :key="$index" class="p-0">
          <Message v-bind="message" />
        </div>

        <infinite-loading :distance="distance" @infinite="loadMoreMessages">
          <span slot="spinner">
            <span slot="no-results" />
            <span slot="no-more" />
            <b-img-lazy src="~/static/loader.gif" />
          </span>
        </infinite-loading>
      </b-col>
    </b-row>
  </div>
</template>
<script>
const groupHeader = () => import('~/components/GroupHeader.vue')
const Message = () => import('~/components/Message.vue')

export default {
  components: {
    groupHeader,
    Message
  },
  props: {
    id: {
      validator: prop => typeof prop === 'number' || typeof prop === 'string',
      required: true
    }
  },

  data: function() {
    return {
      group: null,
      messages: null,
      busy: false,
      context: null,
      distance: 1000
    }
  },

  async mounted() {
    // We have the group id or name in this.id.  Fetch the group.
    await this.$store.dispatch('group/fetch', {
      id: this.id
    })

    this.group = this.$store.getters['group/get'](this.id)
    this.groupid = this.id

    // Now get the approved messages for this group.  We're only interested in showing OFFERs and WANTEDs, and
    // ask for summary info for speed.
    await this.$store.dispatch('messages/fetchMessages', {
      groupid: this.id,
      collection: 'Approved',
      summary: true,
      types: ['Offer', 'Wanted']
    })

    this.messages = this.$store.getters['messages/getByGroup'](this.id)
    this.context = this.$store.getters['messages/getContext']()
  },

  methods: {
    loadMoreMessages: function($state) {
      this.busy = true

      this.$store
        .dispatch('messages/fetchMessages', {
          groupid: this.group ? this.group.id : null,
          collection: 'Approved',
          summary: true,
          types: ['Offer', 'Wanted'],
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
        })
        .catch(() => {
          $state.complete()
        })
    }
  }
}
</script>
