<template>
  <div>
    <b-modal
      :id="'modLogsModal-' + userid + '-' + modmailsonly"
      v-model="showModal"
      :title="title"
      size="xl"
      no-stacking
    >
      <template slot="default">
        <NoticeMessage v-if="!busy && !logs.length" variant="info">
          There are no logs to show.
        </NoticeMessage>
        <div v-else>
          <ModLog v-for="log in logs" :key="'log-' + log.id" :log="log" />
        </div>
        <infinite-loading :key="'infinite-' + userid" @infinite="fetchChunk">
          <span slot="no-results" />
          <span slot="no-more" />
          <span slot="spinner">
            <b-img-lazy src="~/static/loader.gif" alt="Loading" />
          </span>
        </infinite-loading>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="primary" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import InfiniteLoading from 'vue-infinite-loading'
import NoticeMessage from './NoticeMessage'
import ModLog from './ModLog'

export default {
  components: { ModLog, NoticeMessage, InfiniteLoading },
  mixins: [modal],
  props: {
    userid: {
      type: Number,
      required: true
    },
    modmailsonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      busy: false,
      context: null
    }
  },
  computed: {
    logs() {
      return this.$store.getters['logs/list']
    },
    user() {
      let ret = null
      let user = this.$store.getters['user/get'](this.userid)

      if (user && user.info) {
        ret = user
      } else {
        user = this.$store.getters['members/getByUserId'](this.userid)

        if (user && user.info) {
          ret = user
        }
      }

      return ret
    },
    title() {
      let ret

      if (this.modmailsonly) {
        ret = 'Modmails '
      } else {
        ret = 'Logs '
      }

      ret += this.user ? 'for ' + this.user.displayname : ''

      return ret
    }
  },
  methods: {
    show() {
      // Clear the log context - otherwise if we open another modal for this user then it will get confused and
      // fetch from a previous context and show no logs.
      this.$store.dispatch('logs/clear')
      this.showModal = true
    },
    async fetchChunk($state) {
      this.busy = true
      const currentCount = this.logs.length

      this.context = await this.$store.dispatch('logs/fetch', {
        logtype: 'user',
        userid: this.userid,
        context: this.context
      })

      if (this.logs.length === currentCount) {
        // We've returned less than a chunk, so we must be done.
        $state.complete()
      } else {
        $state.loaded()
      }

      this.busy = false
    }
  }
}
</script>
