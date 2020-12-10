<template>
  <div>
    <notice-message v-if="type === 'ReferToOffer'">
      <p>If you're giving away something, then please:</p>
      <b-btn variant="primary" to="/give/whatisit" class="mb-1">
        Post an OFFER
      </b-btn>
      <p>We'll tell more people about that, so you'll get a better response.  This section is just for chat and recommendations.</p>
    </notice-message>
    <notice-message v-if="type === 'ReferToWanted'">
      <p>If you're looking for an item, then please:</p>
      <b-btn variant="primary" to="/find/whatisit" class="mb-1">
        Post a WANTED
      </b-btn>
      <p>We'll tell more people about that, so you'll get a better response.  This section is just for chat and recommendations.</p>
    </notice-message>
    <notice-message v-if="type === 'ReferToTaken'">
      <p>If your item has been taken, please go to My Posts, click on the item, and use the button to <b>Mark as TAKEN</b>.</p>
      <b-btn variant="primary" to="/myposts" class="mb-1">
        Go to My Posts
      </b-btn>
    </notice-message>
    <notice-message v-if="type === 'ReferToReceived'">
      <p>If you've got what you were looking for, please go to My Posts, click on the item, and use the button to <b>Mark as RECEIVED</b>.</p>
      <b-btn variant="primary" to="/myposts" class="mb-1">
        Go to My Posts
      </b-btn>
    </notice-message>
    <div v-if="supportOrAdmin" class="d-flex justify-content-end">
      <b-btn variant="link" class="reply__button" @click="deleteReply">
        Delete
      </b-btn>
      <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" title="Delete refer from" @confirm="deleteConfirm" />
    </div>
  </div>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import NoticeMessage from './NoticeMessage'
const ConfirmModal = () => import('~/components/ConfirmModal.vue')

export default {
  components: { NoticeMessage, ConfirmModal },
  mixins: [waitForRef],
  props: {
    id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    threadhead: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showDeleteModal: false
    }
  },
  methods: {
    deleteReply() {
      this.showDeleteModal = true
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    deleteConfirm() {
      this.$store.dispatch('newsfeed/delete', {
        id: this.id,
        threadhead: this.threadhead.id
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.reply__button {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
