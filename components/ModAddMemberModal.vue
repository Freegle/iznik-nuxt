<template>
  <div>
    <b-modal
      id="addMemberModal"
      v-model="showModal"
      title="Add Member"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <div v-if="addedId">
          We've added them.  In case you need it, their id is
          <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ addedId }}.
        </div>
        <div v-else>
          <NoticeMessage variant="info">
            This will add someone as a member of your community. Please be responsible in how you use this feature.
          </NoticeMessage>
          <b-input v-model="email" type="email" placeholder="Enter their email address" class="mt-2 mb-2" />
          <p>
            If they've not used Freegle before, they will get the standard Freegle welcome mail with an invented
            password so that they can log in.
          </p>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button v-if="!addedId" variant="primary" :disabled="!email" @click="add">
          Add
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  mixins: [modal],
  props: {
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      email: null,
      addedId: null
    }
  },
  methods: {
    async add() {
      this.addedId = await this.$store.dispatch('user/add', {
        email: this.email
      })

      if (this.addedId) {
        await this.$store.dispatch('members/add', {
          userid: this.addedId,
          groupid: this.groupid
        })
      }
    }
  }
}
</script>
