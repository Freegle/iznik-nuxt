<template>
  <div v-if="event && event.pending">
    <b-card no-body>
      <b-card-header>
        <b-row>
          <b-col cols="6" md="4">
            Event <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ event.id }}
          </b-col>
          <b-col cols="6" md="4">
            <span v-if="!event.user.id">
              Added by the system
            </span>
            <span v-else>
              {{ event.user.displayname }}
              <span class="text-muted">
                <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ event.user.id }}
              </span>
            </span>
          </b-col>
          <b-col cols="12" md="4">
            on {{ event.groups[0].nameshort }}
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body>
        <NoticeMessage v-if="event.groups[0].ourPostingStatus === 'PROHIBITED'" variant="danger" class="mb-2">
          This member is set not to be able to post OFFERs/WANTEDs.
        </NoticeMessage>
        <CommunityEvent :item="event" :summary="false" />
      </b-card-body>
      <b-card-footer>
        <b-btn variant="primary" class="mr-1" @click="approve">
          <v-icon name="check" /> Approve
        </b-btn>
        <b-btn variant="white" class="mr-1" @click="edit">
          <v-icon name="pen" /> Edit
        </b-btn>
        <b-btn variant="danger" class="mr-1" @click="deleteme">
          <v-icon name="trash-alt" /> Delete
        </b-btn>
        <ChatButton
          v-if="event.user.id"
          :userid="event.user.id"
          :groupid="event.groups[0].id"
          title="Chat"
          variant="white"
          class="mr-1"
        />
      </b-card-footer>
    </b-card>
    <CommunityEventModal ref="eventmodal" :start-edit="true" :event="event" />
  </div>
</template>
<script>
import NoticeMessage from '@/components/NoticeMessage'
import CommunityEvent from './CommunityEvent'
import ChatButton from './ChatButton'
import CommunityEventModal from './CommunityEventModal'

export default {
  components: {
    CommunityEventModal,
    ChatButton,
    CommunityEvent,
    NoticeMessage
  },

  props: {
    event: {
      type: Object,
      required: true
    }
  },
  methods: {
    edit() {
      this.waitForRef('eventmodal', () => {
        this.$refs.eventmodal.show()
      })
    },
    deleteme() {
      this.$store.dispatch('communityevents/delete', {
        id: this.event.id
      })
    },
    approve() {
      this.$store.dispatch('communityevents/save', {
        id: this.event.id,
        pending: false
      })
    }
  }
}
</script>
