<template>
  <div>
    <client-only>
      <GroupSelect v-model="groupid" modonly all active :work="['chatreview', 'chatreviewother']" />
      <div :key="bump">
        <div v-for="message in visibleMessages" :key="'messagelist-' + message.id" class="p-0 mt-2">
          <ModChatReview :id="message.chatid" :message="message" />
        </div>
        <infinite-loading force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
          <span slot="no-results">
            There are no chat messages to review at the moment.
          </span>
          <span slot="no-more" />
          <span slot="spinner">
            <b-img-lazy src="~/static/loader.gif" alt="Loading" />
          </span>
        </infinite-loading>
      </div>
      <SpinButton
        v-if="visibleMessages && visibleMessages.length > 1"
        variant="white"
        class="mt-2"
        :handler="deleteAll"
        name="trash-alt"
        label="Delete All"
      />
      <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" title="Delete all chat messages?" @confirm="deleteConfirmed" />
    </client-only>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import waitForRef from '@/mixins/waitForRef'
import loginRequired from '@/mixins/loginRequired.js'
import ModChatReview from '../../../components/ModChatReview'
import GroupSelect from '../../../components/GroupSelect'
import ConfirmModal from '../../../components/ConfirmModal'
import SpinButton from '../../../components/SpinButton'

// We need an id for the store.  The null value is a special case used just for retrieving chat review messages.
const REVIEWCHAT = null

export default {
  layout: 'modtools',
  components: {
    SpinButton,
    ConfirmModal,
    GroupSelect,
    ModChatReview,
    InfiniteLoading
  },
  mixins: [loginRequired, waitForRef],
  data: function() {
    return {
      context: null,
      // We fetch less stuff at once for MT.  This is because for slow devices and networks the time to fetch and
      // render is significant, and each of these consumes a lot of screen space.  So by fetching and rendering less,
      // we increase how fast it feels.
      distance: 1000,
      limit: 5,
      show: 0,
      groupid: null,
      bump: 0,
      showDeleteModal: false
    }
  },
  computed: {
    visibleMessages() {
      return this.messages.slice(0, this.show).filter(message => {
        return message !== null
      })
    },
    messages() {
      let ret = this.$store.getters['chatmessages/getMessages'](REVIEWCHAT)

      if (!this.groupid) {
        ret = ret.filter(m => {
          return m && this.amActiveModOn(m.group.id)
        })
      }

      return ret
    },
    work() {
      // Count for the type of work we're interested in.
      const work = this.$store.getters['auth/work']
      return work.chatreview
    },
    group() {
      return this.$store.getters['group/get'](this.groupid)
    }
  },
  watch: {
    work(newVal, oldVal) {
      if (newVal > oldVal) {
        this.clearAndLoad()
      } else {
        const visible = this.$store.getters['misc/get']('visible')

        if (!visible) {
          this.clearAndLoad()
        }
      }
    },
    groupid(newVal, oldVal) {
      this.clearAndLoad()
    }
  },
  async mounted() {
    await this.clearAndLoad()
  },
  methods: {
    loadMore: function($state) {
      if (this.show < this.messages.length) {
        // This means that we will gradually add the messages that we have fetched from the server into the DOM.
        // Doing that means that we will complete our initial render more rapidly and thus appear faster.
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.messages.length

        this.$store
          .dispatch('chatmessages/fetch', {
            chatid: REVIEWCHAT,
            context: this.context,
            limit: this.limit
          })
          .then(() => {
            this.context = this.$store.getters['chatmessages/getContext']

            if (currentCount === this.messages.length) {
              this.complete = true
              $state.complete()
            } else {
              $state.loaded()
              this.show++
            }
          })
          .catch(e => {
            $state.complete()
            console.log('Complete on error', e)
          })
      }
    },
    async clearAndLoad() {
      // There's new stuff to do.  Reload.
      console.log('Clear and load')
      // We don't want to pick up any real chat messages.
      await this.$store.dispatch('chatmessages/clearContext', {
        chatid: REVIEWCHAT
      })

      await this.$store.dispatch('chatmessages/clearMessages', {
        chatid: REVIEWCHAT
      })

      await this.$store.dispatch('chatmessages/fetch', {
        chatid: REVIEWCHAT,
        limit: this.limit,
        groupid: this.groupid
      })

      this.bump++
    },
    deleteAll() {
      this.showDeleteModal = true
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    async deleteConfirmed() {
      await this.visibleMessages.forEach(async m => {
        await this.$store.dispatch('chatmessages/reject', {
          id: m.id,
          chatid: null
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
</style>
