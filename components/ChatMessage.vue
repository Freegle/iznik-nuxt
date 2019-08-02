<template>
  <div>
    <b-row>
      <b-col>
        <div v-if="chatmessage.userid != $store.state.auth.user.id">
          <b-img-lazy
            rounded="circle"
            thumbnail
            class="profilesm p-0 ml-1 mb-1 inline"
            alt="Profile picture"
            title="Profile"
            :src="otheruser.profile.turl"
          />
          <span class="chatMessage">
            <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap"><b>{{ emessage }}</b></span>
            <span v-else class="prewrap">{{ emessage }}</span>
            <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
          </span>
        </div>
        <div v-else class="float-right">
          <span class="chatMessage">
            <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap"><b>{{ emessage }}</b></span>
            <span v-else class="prewrap">{{ emessage }}</span>
            <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
          </span>
          <b-img-lazy
            rounded="circle"
            thumbnail
            class="profilesm p-0 ml-1 mb-1 inline"
            alt="Profile picture"
            title="Profile"
            :src="me.profile.turl"
          />
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!chatmessage.sameaslast" class="text-muted small">
      <b-col v-if="chatmessage.userid != $store.state.auth.user.id">
        {{ $moment(chatmessage.date).fromNow() }}
      </b-col>
      <b-col v-else>
        <span class="float-right">
          {{ $moment(chatmessage.date).fromNow() }}
        </span>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
import twem from '~/assets/js/twem'

export default {
  props: {
    chat: {
      type: Object,
      required: true
    },
    chatmessage: {
      type: Object,
      required: true
    },
    me: {
      type: Object,
      required: true
    },
    otheruser: {
      type: Object,
      required: true
    }
  },
  computed: {
    emessage() {
      return twem.twem(this.$twemoji, this.chatmessage.message).trim()
    }
  }
}
</script>
