<template>
  <div>
    <b-card bg-variant="white" no-body>
      <b-card-header>
        <!--        TODO Edits-->
        <!--        TODO Colour code-->
        {{ eSubject }}
        <MessageHistory :message="message" modinfo />
        <!--        TODO Duplicates, related-->
        <!--        Worry Words-->
        <!--        Outcomes-->
        <!--        View Source-->
      </b-card-header>
      <b-card-body>
        <!--        Held by-->
        <b-row>
          <b-col cols="12" lg="8">
            <div v-if="message.location">
              <b-input-group>
                <b-select v-model="message.type" :options="typeOptions" class="type" />
                <b-input v-model="message.item.name" />
                <b-input v-model="message.location.name" class="location" />
                <b-input-group-append>
                  <b-button variant="white" disabled @click="saveStructuredSubject">
                    <v-icon v-if="savingSubject" name="sync" class="text-success fa-spin" />
                    <v-icon v-else-if="savedSubject" name="check" class="text-success" />
                    <v-icon v-else name="save" />
                    Save
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div v-else>
              <b-input-group>
                <b-input v-model="message.subject" />
                <b-input-group-append>
                  <b-button variant="white" disabled @click="saveUnstructuredSubject">
                    <v-icon v-if="savingSubject" name="sync" class="text-success fa-spin" />
                    <v-icon v-else-if="savedSubject" name="check" class="text-success" />
                    <v-icon v-else name="save" />
                    Save
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
            <!-- eslint-disable-next-line -->
            <div class="mt-3 mb-3 rounded border pl-1 pr-1 prewrap forcebreak font-weight-bold">{{ message.textbody }}</div>
            <!--        TODO Attachments-->
            <MessageReplyInfo :message="message" class="d-inline" />
          </b-col>
          <b-col cols="12" lg="4">
            <div class="rounded border border-info p-2">
              <MessageUserInfo :user="message.fromuser" modinfo :groupid="message.groups[0].groupid" />
              <ModPostingHistory :user="message.fromuser" />
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
              />
              <!--              TODO Handle changes-->
              <!--              Email list-->
              <!--              Active on-->
              <!--              Group list-->
              <!--              Applied list-->
            </div>
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
import ModPostingHistory from './ModPostingHistory'
import twem from '~/assets/js/twem'

export default {
  name: 'ModMessage',
  components: {
    ModPostingHistory,
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
      savingSubject: false,
      savedSubject: false,
      showMailSettings: false
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
