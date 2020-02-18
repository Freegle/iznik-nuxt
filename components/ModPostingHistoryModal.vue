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
        <b-row v-for="message in messages" :key="message.id">
          <b-col cols="8" sm="3">
            <div>{{ message.arrival | datetimeshort }}</div>
          </b-col>
          <b-col cols="4" sm="3">
            <div><v-icon name="hashtag" scale="0.75" class="text-muted" />{{ message.id }}</div>
          </b-col>
          <b-col cols="12" sm="6">
            <div>{{ message.subject }}</div>
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
export default {
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
      console.log('Messages for', this.user)
      return this.user.messagehistory.filter(message => {
        return !this.type || this.type === message.type
      })
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
