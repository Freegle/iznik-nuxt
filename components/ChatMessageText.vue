<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div class="chatMessageWrapper" :class="messageIsFromCurrentUser ? 'myChatMessage' : ''">
          <div class="chatMessage" :class="messageIsFromCurrentUser ? 'mine' : 'theirs'">
            <span>
              <span v-if="messageIsNew" class="prewrap"><b>{{ emessage }}</b></span>
              <span v-else class="prewrap forcebreak">{{ emessage }}</span>
              <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
            </span>
          </div>
          <div class="chatMessageProfilePic">
            <div>
              <profile-image :image="me.profile.turl" class="ml-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
            </div>
          </div>
        </div>
        <!--
        <div v-if="messageIsFromCurrentUser" class="myChatMessage chatMessageWrapper">
          <div :class="emessage ? 'chatMessage mine' : ''">
            <span>
              <span v-if="messageIsNew" class="prewrap"><b>{{ emessage }}</b></span>
              <span v-else class="prewrap forcebreak">{{ emessage }}</span>
              <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
            </span>
          </div>
          <div class="chatMessageProfilePic">
            <div>
              <profile-image :image="me.profile.turl" class="ml-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
            </div>
          </div>
        </div>
        <div v-else class="chatMessageWrapper">
          <div class="chatMessageProfilePic">
            <div>
              <profile-image v-if="othericon" :image="othericon" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
            </div>
          </div>
          <div :class="emessage ? 'chatMessage theirs' : ''">
            <span>
              <span v-if="messageIsNew" class="prewrap"><b>{{ emessage }}</b></span>
              <span v-else class="prewrap forcebreak">{{ emessage }}</span>
              <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
            </span>
          </div>
        </div>
      -->
      </b-col>
    </b-row>
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
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
  word-wrap: break-word;
  line-height: 1.75;
}

.myChatMessage {
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

.theirs {
  background-color: $color-white;
  order: 2;
}

.mine {
  background-color: $color-green--light;
}

:-ms-fullscreen,
:root .ie11up {
  .media {
    /*On IE11 this stops the chat messages being only a character wide.   */
    min-width: 40%;
  }
}
</style>
