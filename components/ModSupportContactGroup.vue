<template>
  <div>
    <label>From:</label>
    <b-select v-model="from">
      <option value="null">
        -- Please choose --
      </option>
      <option value="info">
        info@...
      </option>
      <option value="support">
        support@...
      </option>
      <option value="mentors">
        mentors@...
      </option>
      <option value="newgroups">
        newgroups@...
      </option>
      <option value="geeks">
        geeks@...
      </option>
      <option value="board">
        board@...
      </option>
      <option value="ro">
        returningofficer@...
      </option>
      <option value="volunteers">
        volunteers@...
      </option>
      <option value="centralmods">
        centralmods@...
      </option>
    </b-select>
    <label>
      To:
    </label>
    <GroupSelect v-model="groupid" systemwide listall />
    <NoticeMessage v-if="groupid < 0" variant="danger" class="mt-2 mb-2">
      This will go to all groups.
    </NoticeMessage>
    <label>
      Try hard?
    </label>
    <b-select v-model="tryhard">
      <option :value="false">
        Just mail primary email
      </option>
      <option :value="true">
        Mail all email addresses we know
      </option>
    </b-select>
    <label>
      Confirm receipt
    </label>
    <b-select v-model="confirm">
      <option :value="false">
        Don't ask to click
      </option>
      <option :value="true">
        Ask them to click to confirm receipt
      </option>
    </b-select>
    <label>Subject</label>
    <b-input v-model="subject" placeholder="Brief subject of this message" />
    <label>Text version</label>
    <b-textarea v-model="text" rows="10" />
    <label>HTML version (optional)</label>
    <VueEditor v-model="html" :editor-options="editorOptions" class="bg-white" />
    <NoticeMessage v-if="groupid < 0" variant="danger" class="mt-2 mb-2">
      This will go to all groups.
    </NoticeMessage>
    <SpinButton
      v-if="groupid < 0"
      variant="danger"
      label="Send to all groups"
      name="envelope"
      spinclass="text-white"
      :disabled="!valid"
      class="mt-2 mb-2"
      size="lg"
      :handler="send"
    />
    <SpinButton
      v-else
      variant="primary"
      label="Send"
      name="envelope"
      spinclass="text-white"
      :disabled="!valid"
      class="mt-2 mb-2"
      size="lg"
      :handler="send"
    />
    <div v-if="alerts && alerts.length">
      <b-row>
        <b-col cols="6" lg="2">
          <b>Created</b>
        </b-col>
        <b-col cols="6" lg="2">
          <b>Complete</b>
        </b-col>
        <b-col cols="6" lg="2">
          <b>To</b>
        </b-col>
        <b-col cols="6" lg="4">
          <b>Subject</b>
        </b-col>
        <b-col cols="6" lg="2" />
      </b-row>
      <ModAlertHistory v-for="alert in alerts" :key="'alert-' + alert.id" :alert="alert" />
    </div>
    <b-img v-else-if="busy" src="~/static/loader.gif" alt="Loading" class="d-block" />
    <b-btn v-else variant="white" size="lg" class="mt-2 mb-2 d-block" @click="fetch">
      Show history
    </b-btn>
  </div>
</template>
<script>
import GroupSelect from './GroupSelect'
import NoticeMessage from './NoticeMessage'
import SpinButton from './SpinButton'
import ModAlertHistory from './ModAlertHistory'

let VueEditor, htmlEditButton

if (process.client) {
  htmlEditButton = require('quill-html-edit-button').htmlEditButton
  VueEditor = require('vue2-editor').VueEditor
  const Quill = require('vue2-editor').Quill
  Quill.register('modules/htmlEditButton', htmlEditButton)
}

export default {
  components: {
    ModAlertHistory,
    SpinButton,
    NoticeMessage,
    GroupSelect,
    VueEditor
  },
  data: function() {
    return {
      busy: false,
      from: null,
      groupid: null,
      tryhard: false,
      confirm: false,
      subject: null,
      text: null,
      html: null,
      editorOptions: {
        modules: {
          htmlEditButton: {}
        }
      }
    }
  },
  computed: {
    valid() {
      return this.from && this.subject && this.text
    },
    alerts() {
      const alerts = Object.values(this.$store.getters['alert/list'])
      alerts.sort(function(a, b) {
        return new Date(b.created).getTime() - new Date(a.created).getTime()
      })

      return alerts
    }
  },
  methods: {
    async send() {
      const data = {
        from: this.from,
        subject: this.subject,
        text: this.text,
        html: this.html,
        askclick: this.confirm ? 1 : 0,
        tryhard: this.tryhard ? 1 : 0
      }

      if (this.groupid > 0) {
        data.groupid = this.groupid
      } else {
        data.groupid = 'AllFreegle'
      }

      await this.$store.dispatch('alert/add', data)
    },
    async fetch() {
      this.busy = true

      await this.$store.dispatch('alert/fetch')

      this.busy = false
    }
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
}

select {
  max-width: 400px;
  display: block;
}
</style>
