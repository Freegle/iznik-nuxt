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
          <b-col cols="4" sm="2">
            <div><v-icon name="hashtag" scale="0.75" class="text-muted" />{{ message.id }}</div>
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
      const ret = this.user.messagehistory.filter(message => {
        return !this.type || this.type === message.type
      })

      ret.forEach(message => {
        const group = this.$store.getters['auth/groupById'](message.groupid)
        message.groupname = group.namedisplay
      })

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
