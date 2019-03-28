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
              <fa icon="gift" />&nbsp;Give stuff
            </b-button>
          </b-col>
          <b-col cols="2" />
          <b-col cols="5">
            <b-button to="/find" class="mt-1" size="lg" block variant="primary">
              <fa icon="search" />&nbsp;Find stuff
            </b-button>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="200">
      <b-list-group>
        <b-list-group-item v-for="message in messages" :key="message.id" class="p-0">
          <message v-bind="message" />
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script>
import groupHeader from '~/components/groupheader.vue'
import message from '~/components/message.vue'

export default {
  components: {
    groupHeader,
    message
  },
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
    await store.dispatch('messages/fetch', {
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
    loadMore: function() {
      console.log('loadMore', this.context)
      this.busy = true

      this.$store
        .dispatch('messages/fetch', {
          groupid: this.group.id,
          collection: 'Approved',
          summary: true,
          types: ['Offer', 'Wanted'],
          context: this.context
        })
        .then(() => {
          this.busy = false
          this.messages = this.$store.getters['messages/getByGroup'](
            this.group.id
          )
          this.context = this.$store.getters['messages/getContext']()
          console.log('Now got', this.context)
        })
    }
  }
}
</script>
