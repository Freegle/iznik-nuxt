<template>
  <div>
    <b-modal
      :id="'modCommentModal-' + user.id"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        Edit Note for {{ user.displayname }}
      </template>
      <template slot="default">
        <p>
          You can add one or more notes about members.  They'll appear in a coloured box next to the user.
        </p>
        <p>
          These comments can be seen by moderators, and also by members who choose to download their data under
          GDPR.  So keep them objective, polite and factual please.
        </p>
        <b-input v-model="comment.user1" :placeholder="placeholders[1]" />
        <b-input v-model="comment.user2" :placeholder="placeholders[2]" />
        <b-input v-model="comment.user3" :placeholder="placeholders[3]" />
        <b-input v-model="comment.user4" :placeholder="placeholders[4]" />
        <b-input v-model="comment.user5" :placeholder="placeholders[5]" />
        <b-input v-model="comment.user6" :placeholder="placeholders[6]" />
        <b-input v-model="comment.user7" :placeholder="placeholders[7]" />
        <b-input v-model="comment.user8" :placeholder="placeholders[8]" />
        <b-input v-model="comment.user9" :placeholder="placeholders[9]" />
        <b-input v-model="comment.user10" :placeholder="placeholders[10]" />
        <b-input v-model="comment.user11" :placeholder="placeholders[11]" />
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button variant="success" @click="save">
          Save
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
    comment: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      placeholders: [
        null,
        'Add a comment about this member here',
        '...and more information here',
        '...and here',
        '...you get the idea'
      ]
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async save() {
      // Go direct to API because comments aren't in the Store separately.
      await this.$api.comment.save(this.comment)
      this.$emit('edited')
      this.hide()
    }
  }
}
</script>
