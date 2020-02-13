<template>
  <div>
    <b-card bg-variant="white" no-body>
      <b-card-header class="d-flex justify-content-between">
        <!--        TODO Edits-->
        <!--        TODO Colour code-->
        <div>
          <div v-if="!editing">
            {{ eSubject }}
          </div>
          <div v-else>
            <div v-if="message.location">
              <b-input-group>
                <b-select v-model="message.type" :options="typeOptions" class="type" />
                <b-input v-model="message.item.name" />
                <b-input v-model="message.location.name" class="location" />
              </b-input-group>
            </div>
            <div v-else>
              <b-input-group>
                <b-input v-model="message.subject" />
              </b-input-group>
            </div>
          </div>
          <MessageHistory :message="message" modinfo />
        </div>
        <div>
          <b-btn v-if="!editing" variant="white" @click="editing = true">
            <v-icon name="pen" /> Edit
          </b-btn>
          <b-btn v-if="editing" variant="white" @click="editing = false">
            <v-icon name="" /> Cancel
          </b-btn>
          <b-button v-if="editing" variant="white" disabled @click="save">
            <v-icon v-if="saving" name="sync" class="text-success fa-spin" />
            <v-icon v-else-if="saved" name="check" class="text-success" />
            <v-icon v-else name="save" />
            Save
          </b-button>
        </div>
        <!--        TODO Duplicates, related-->
        <!--        Worry Words-->
        <!--        Outcomes-->
        <!--        View Source-->
      </b-card-header>
      <b-card-body>
        <!--        Held by-->
        <b-row>
          <b-col cols="12" lg="8">
            <b-form-textarea
              v-if="editing"
              v-model="message.textbody"
              rows="8"
              class="mb-3"
            />
            <!-- eslint-disable-next-line -->
            <div v-else class="mb-3 rounded border p-2 prewrap forcebreak font-weight-bold">{{ eBody }}</div>
            <div v-if="message.attachments && message.attachments.length" class="d-flex">
              <ModImage v-for="attachment in message.attachments" :key="'attachment-' + attachment.id" :attachment="attachment" class="d-inline pr-1" />
            </div>
            <MessageReplyInfo :message="message" class="d-inline" />
          </b-col>
          <b-col cols="12" lg="4">
            <div class="rounded border border-info p-2 d-flex justify-content-between flex-wrap">
              <MessageUserInfo :user="message.fromuser" modinfo :groupid="message.groups[0].groupid" />
              <!--              Email list-->
              <!--              Active on-->
              <!--              Group list-->
              <!--              Applied list-->
            </div>
            <div>
              <b-btn variant="link" @click="showMailSettings = !showMailSettings">
                <span v-if="showMailSettings">
                  Hide mail settings
                </span>
                <span v-else>
                  Show mail settings
                </span>
              </b-btn>
            </div>
            <SettingsGroup
              v-if="showMailSettings"
              :groupid="message.groups[0].groupid"
              :emailfrequency="membership.emailfrequency"
              :volunteeringallowed="Boolean(membership.volunteeringallowed)"
              :eventsallowed="Boolean(membership.eventsallowed)"
              class="border border-info mt-2 p-1"
            />
            <!--              TODO Handle changes-->
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
// TODO Validation
// - item length
import MessageHistory from './MessageHistory'
import MessageUserInfo from './MessageUserInfo'
import MessageReplyInfo from './MessageReplyInfo'
import SettingsGroup from './SettingsGroup'
import ModImage from './ModImage'
import twem from '~/assets/js/twem'

export default {
  name: 'ModMessage',
  components: {
    ModImage,
    SettingsGroup,
    MessageReplyInfo,
    MessageUserInfo,
    MessageHistory
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      saving: false,
      saved: false,
      showMailSettings: false,
      editing: false
    }
  },
  computed: {
    typeOptions() {
      // TODO Per group keywords
      return [
        {
          value: 'Offer',
          text: 'OFFER'
        },
        {
          value: 'Wanted',
          text: 'WANTED'
        }
      ]
    },
    eSubject() {
      return twem.twem(this.$twemoji, this.message.subject)
    },
    eBody() {
      return twem.twem(this.$twemoji, this.message.textbody)
    },
    membership() {
      let ret = null
      const groupid =
        this.message.groups && this.message.groups.length > 0
          ? this.message.groups[0].groupid
          : null

      if (groupid) {
        ret = this.message.fromuser.memberof.find(g => g.id === groupid)
      }

      return ret
    }
  },
  methods: {
    saveStructuredSubject() {
      // TODO
    },
    saveUnstructuredSubject() {
      // TODO
    }
  }
}
</script>
<style scoped>
.type {
  max-width: 150px;
}
.location {
  max-width: 250px;
}
</style>
