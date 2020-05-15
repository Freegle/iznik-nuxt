<template>
  <div>
    <b-modal
      :id="'modPostingHistoryModal-' + user.id"
      v-model="showModal"
      :title="'Post Summary for ' + user.displayname"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <NoticeMessage v-if="!messages.length" variant="info">
          There are no posts to show.
        </NoticeMessage>
        <b-row v-for="message in messages" :key="'postinghistory-' + message.id">
          <b-col cols="8" sm="3">
            <div>{{ message.arrival | datetimeshort }}</div>
          </b-col>
          <b-col cols="4" sm="2">
            <div>
              <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ message.id }}
              <span v-if="message.repost">
                <v-icon v-if="message.autorepost" name="sync" class="text-danger" title="Auto-repost" />
                <v-icon v-else name="hand-paper" class="text-danger" title="Manual repost" />
              </span>
            </div>
          </b-col>
          <b-col cols="12" sm="7">
            <div>
              {{ message.subject }}
            </div>
            <div class="text-muted">
              on {{ message.groupname }}
            </div>
          </b-col>
        </b-row>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="success" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    user: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {
    messages() {
      const ret = []

      if (this.user && this.user.messagehistory) {
        const ret = this.user.messagehistory.filter(message => {
          return !this.type || this.type === message.type
        })

        ret.forEach(message => {
          const group = this.$store.getters['auth/groupById'](message.groupid)
          message.groupname = group ? group.namedisplay : '#' + message.groupid
        })

        ret.sort((a, b) => {
          return new Date(b.arrival).getTime() - new Date(a.arrival).getTime()
        })
      }

      return ret
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
