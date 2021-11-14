<template>
  <div class="clickme" @click="click">
    <div class="messagecard p-2">
      <div class="image-wrapper">
        <b-img-lazy
          v-if="!imageBroken && attachment"
          rounded
          generator-unable-to-provide-required-alt=""
          title="Item picture"
          :src="attachment"
          itemprop="image"
          class="attachment"
          @error.native="brokenImage"
        />
      </div>
      <div class="rest">
        <MessageItemLocation
          :id="message.id"
          class="mb-1 header-title"
          :type="message.type"
          :expanded="false"
          :message-override="message"
        />
        <MessageHistory :message="message" class="mb-1 header-history" :display-message-link="sm()" />
      </div>
    </div>
    <notice-message v-if="message.outcomes && message.outcomes.length && false" class="mt-2 mb-2">
      <v-icon name="info-circle" />
      <span v-if="message.type === 'Offer'">
        This is no longer available.
      </span>
      <span v-else>
        They are no longer looking for this.
      </span>
    </notice-message>
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import breakpoints from '@/mixins/breakpoints'
import MessageItemLocation from '~/components/MessageItemLocation'

const MessageHistory = () => import('~/components/MessageHistory')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    MessageItemLocation,
    MessageHistory,
    NoticeMessage
  },
  mixins: [breakpoints],
  props: {
    message: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      imageBroken: false
    }
  },
  computed: {
    attachment() {
      return this.message &&
        this.message.attachments &&
        this.message.attachments.length
        ? this.message.attachments[0].paththumb
        : null
    }
  },
  methods: {
    brokenImage() {
      this.imageBroken = true
    },
    click() {
      if (this.message.fromuser && this.message.fromuser.id === this.myid) {
        this.$router.push('/mypost/' + this.message.id)
      } else {
        this.$router.push('/message/' + this.message.id)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.messagecard {
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px $color-gray--light;
  background-color: $color-gray--lighter;

  display: grid;
  align-items: start;

  grid-template-columns: max-content minmax(0, 1fr);
  grid-column-gap: 1rem;
  grid-template-rows: max-content auto;

  .image-wrapper {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
  }

  .rest {
    grid-row: 1 / 3;
    grid-column: 2 / 3;
  }
}

/deep/ label {
  font-weight: bold;
}

.attachment {
  object-fit: cover;
  height: 100px;
  width: 100px;
  box-shadow: 0 0 1 $color-gray--dark;
}
</style>
