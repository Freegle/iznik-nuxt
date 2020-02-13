<template>
  <div>
    <b-card bg-variant="white" no-body>
      <b-card-header>
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
        <div v-if="message.location">
          <b-input-group>
            <b-select v-model="message.type" :options="typeOptions" class="type" />
            <b-input v-model="message.item.name" />
            <b-input v-model="message.location.name" class="location" />
            <b-input-group-append>
              <b-button variant="white" @click="saveStructuredSubject">
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
              <b-button variant="white" @click="saveUnstructuredSubject">
                <v-icon v-if="savingSubject" name="sync" class="text-success fa-spin" />
                <v-icon v-else-if="savedSubject" name="check" class="text-success" />
                <v-icon v-else name="save" />
                Save
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="mt-1 mb-2 rounded border pl-1 pr-1 prewrap forcebreak">{{ message.textbody }}</div>
        <!--        TODO Attachments-->
        <div class="rounded border border-info p-2 d-flex justify-content-between">
          <MessageUserInfo :user="message.fromuser" class="d-inline" />
          <MessageReplyInfo :message="message" class="d-inline" />
        </div>
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
import twem from '~/assets/js/twem'

export default {
  name: 'ModMessage',
  components: { MessageReplyInfo, MessageUserInfo, MessageHistory },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      savingSubject: false,
      savedSubject: false
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
