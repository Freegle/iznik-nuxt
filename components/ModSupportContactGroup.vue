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
    <GroupSelect v-model="groupid" systemwide />
    <NoticeMessage v-if="groupid < 0" variant="danger" class="mt-2 mb-2">
      This will go to all groups.
    </NoticeMessage>
    <label>
      Try hard?
    </label>
    <b-select v-model="tryhard">
      <option value="false">
        Just mail primary email
      </option>
      <option value="true">
        Mail all email addresses we know
      </option>
    </b-select>
    <label>
      Confirm receipt
    </label>
    <b-select v-model="confirm">
      <option value="false">
        Don't ask to click
      </option>
      <option value="true">
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
      variant="success"
      label="Send"
      name="envelope"
      spinclass="text-white"
      :disabled="!valid"
      class="mt-2 mb-2"
      size="lg"
      :handler="send"
    />
  </div>
</template>
<script>
import GroupSelect from './GroupSelect'
import NoticeMessage from './NoticeMessage'
import SpinButton from './SpinButton'

let VueEditor, htmlEditButton

if (process.client) {
  htmlEditButton = require('quill-html-edit-button').htmlEditButton
  VueEditor = require('vue2-editor').VueEditor
  const Quill = require('vue2-editor').Quill
  Quill.register('modules/htmlEditButton', htmlEditButton)
}

export default {
  components: { SpinButton, NoticeMessage, GroupSelect, VueEditor },
  data: function() {
    return {
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
      return this.from && this.groupid > 0 && this.subject && this.text
    }
  },
  methods: {
    async send() {
      await this.$store.dispatch('alert/add', {
        groupid: this.groupid,
        from: this.from,
        subject: this.subject,
        text: this.text,
        html: this.html,
        askclick: this.confirm,
        tryhard: this.tryhard
      })
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
