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
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>
