<template>
  <div v-if="chat" class="clickme noselect" @click="click">
    <b-row class="ml-1 mr-1">
      <b-col class="pl-0">
        <b-img-lazy
          v-if="chat.icon"
          rounded="circle"
          thumbnail
          class="profile p-0 ml-1 mb-1 inline"
          alt="Profile picture"
          title="Profile"
          :src="chat.icon"
        />
        <b-img-lazy
          v-else
          rounded="circle"
          thumbnail
          class="profile p-0 ml-1 mb-1 inline"
          alt="Profile picture"
          title="Profile"
          src="~/static/defaultprofile.png"
        />
        <span class="pl-0 mb-0 chatname">
          {{ chat.name }}
        </span>
        <span v-if="chat.unseen">
          <b-badge variant="danger">{{ chat.unseen }}</b-badge>
        </span>
        <span class="float-right small text-muted">
          {{ $dayjs(chat.lastdate).fromNow() }}
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="chat.snippet" class="pl-4 truncate">
        {{ esnippet }}
      </b-col>
      <b-col v-else class="pl-4">
        ...
      </b-col>
    </b-row>
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

img.profile {
  max-height: 25px !important;
  max-width: 25px !important;
}

.chatname {
  color: $colour-info-fg;
  font-weight: bold;
  white-space: nowrap;
}
</style>

<script>
import twem from '~/assets/js/twem'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },

  computed: {
    chat() {
      return this.$store.getters['chats/get'](this.id)
    },

    esnippet() {
      let ret = twem.twem(this.$twemoji, this.chat.snippet)

      // The way the snippet is constructed might lead to backslashes if we have an emoji.
      ret = ret.replace(/\\*$/, '') + '...'
      return ret
    }
  },

  methods: {
    click: function() {
      this.$router.push('/chats/' + this.id)
    }
  }
}
</script>
