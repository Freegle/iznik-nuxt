<template>
  <div class="chatMessageWrapper pb-1" :class="{ myChatMessage : messageIsFromCurrentUser }">
    <div class="chatMessage chatMessage__owner">
      <span>
        <span v-if="messageIsNew" class="prewrap"><b>{{ emessage }}</b></span>
        <span v-else class="prewrap forcebreak">{{ emessage }}</span>
        <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
      </span>
    </div>
    <div class="chatMessageProfilePic">
      <ProfileImage :image="messageIsFromCurrentUser ? me.profile.turl : othericon" class="ml-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
    </div>
  </div>
</template>

<script>
import ChatBase from '~/components/ChatBase'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage
  },
  extends: ChatBase,
  computed: {
    messageIsFromCurrentUser() {
      return this.chatmessage.userid === this.$store.state.auth.user.id
    },
    messageIsNew() {
      return (
        this.chatmessage.secondsago < 60 ||
        this.chatmessage.id > this.chat.lastmsgseen
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.chatMessage {
  border: 1px solid $color-gray--light;
  border-radius: 10px;
  padding: 2px 4px 2px 4px;
  word-wrap: break-word;
  line-height: 1.75;
}

.chatMessage__owner {
  background-color: $color-white;
  order: 2;
}

.myChatMessage {
  .chatMessage__owner {
    background-color: $color-green--light;
    order: 0;
  }

  .chatMessage {
    margin-left: auto;
  }

  .chatMessageProfilePic {
    left: 0;
  }
}

.chatMessageProfilePic {
  min-width: 25px;
  position: relative;
  top: 3px;
  left: 3px;
  margin-right: 5px;

  @include media-breakpoint-up(md) {
    min-width: 35px;
  }
}

.chatMessageWrapper {
  display: flex;
  padding-right: 10px;

  &.myChatMessage {
    padding-left: 10px;
    padding-right: 0;
  }
}
</style>
