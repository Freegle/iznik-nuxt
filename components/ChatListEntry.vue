<template>
  <div v-if="chat" class="clickme noselect" @click="click">
    <b-row class="ml-1 mr-1">
      <b-col class="pl-0">
        <profile-image v-if="chat.icon" :image="chat.icon" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="md" />
        <span class="pl-0 mb-0 chatname">
          {{ chat.name }}
        </span>
        <span v-if="chat.unseen">
          <b-badge variant="danger">{{ chat.unseen }}</b-badge>
        </span>
        <span class="float-right small text-muted">
          {{ chat.lastdate | timeago }}
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="chat.snippet && chat.snippet !== 'false'" class="pl-4 truncate">
        {{ esnippet }}
      </b-col>
      <b-col v-else class="pl-4">
        ...
      </b-col>
    </b-row>
  </div>
</template>

<script>
import twem from '~/assets/js/twem'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage
  },
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

<style scoped lang="scss">
@import 'color-vars';

.chatname {
  color: $colour-info-fg;
  font-weight: bold;
  white-space: nowrap;
}
</style>
