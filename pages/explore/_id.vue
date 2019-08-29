<template>
  <div>
    <groupHeader v-if="group" :key="'group-' + (group ? group.id : null)" v-bind="group" />
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
      <message v-bind="message" />
    </div>

    <infinite-loading @infinite="loadMore">
      <span slot="spinner">
        <span slot="no-results" />
        <span slot="no-more" />
        <b-img-lazy src="~/static/loader.gif" />
      </span>
    </infinite-loading>
  </div>
</template>
<script>
import groupHeader from '~/components/GroupHeader.vue'
import message from '~/components/Message.vue'
import loginOptional from '@/mixins/loginOptional.js'

export default {
  components: {
    groupHeader,
    message
  },
  mixins: [loginOptional],
  data() {
    return {
      id: null,
      group: null,
      messages: null,
      busy: false,
      context: null
    }
  },
  computed: {},
  async asyncData({ app, params, store }) {
    // We have the group id or name in params.id.  Fetch the group.
    await store.dispatch('group/fetch', {
      id: params.id
    })

    const group = store.getters['group/get'](params.id)

    // Now get the approved messages for this group.  We're only interested in showing OFFERs and WANTEDs, and
    // ask for summary info for speed.
    await store.dispatch('messages/fetchMessages', {
      groupid: group.id,
      collection: 'Approved',
      summary: true,
      types: ['Offer', 'Wanted']
    })

    const messages = store.getters['messages/getByGroup'](group.id)
    const context = store.getters['messages/getContext']()

    return {
      id: group.id,
      group: group,
      messages: messages,
      context: context
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  methods: {
    loadMore: function($state) {
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
