<template>
  <div class="chatMessageWrapper" :class="{ myChatMessage : messageIsFromCurrentUser }">
    <div class="chatMessage forcebreak chatMessage__owner">
      <span v-if="!highlightEmails">
        <span v-if="modtools">
          <!-- eslint-disable-next-line-->
          <span v-if="messageIsNew" class="prewrap font-weight-bold" v-html="emessage" />
          <!-- eslint-disable-next-line-->
          <span v-else class="preline forcebreak" v-html="emessage" />
        </span>
        <span v-else>
          <span v-if="messageIsNew" class="prewrap font-weight-bold">{{ emessage }}</span>
          <span v-else class="preline forcebreak">{{ emessage }}</span>
        </span>
        <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
      </span>
      <span v-else>
        <span v-if="messageIsNew" class="font-weight-bold">
          <Highlighter
            :text-to-highlight="emessage"
            :search-words="[regexEmail]"
            highlight-class-name="highlight"
            class="prewrap"
          />
        </span>
        <span v-else>
          <Highlighter
            :text-to-highlight="emessage"
            :search-words="[regexEmail]"
            highlight-class-name="highlight"
            class="preline forcebreak"
          />
        </span>
        <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
      </span>
    </div>
    <div class="chatMessageProfilePic">
      <ProfileImage :image="chatMessageProfileImage" class="ml-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
    </div>
  </div>
</template>

<script>
import Highlighter from 'vue-highlight-words'
import ChatBase from '~/components/ChatBase'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage,
    Highlighter
  },
  extends: ChatBase,
  computed: {
    messageIsNew() {
      return (
        this.chatmessage.secondsago < 60 ||
        this.chatmessage.id > this.chat.lastmsgseen
      )
    }
  }
}
</script>
