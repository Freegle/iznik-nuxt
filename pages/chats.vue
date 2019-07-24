<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="3" class="chatlist">
        <ul v-for="(chat, $index) in sortedChats" :key="'chat-' + $index" class="p-0 list-unstyled mb-1">
          <li>
            <b-row>
              <b-col class="pl-0">
                <span v-if="chat.user2 === $store.state.auth.user.id">
                  <b-img-lazy
                    v-if="chat.u1imageurl"
                    rounded="circle"
                    thumbnail
                    class="profile p-0 ml-1 mb-1 inline"
                    alt="Profile picture"
                    title="Profile"
                    :src="chat.u1imageurl"
                  />
                  <b-img-lazy
                    v-else
                    rounded="circle"
                    thumbnail
                    class="profile p-0 ml-1 mb-1 inline"
                    alt="Profile picture"
                    title="Profile"
                    src="~/static/placeholder.jpg"
                  />
                </span>
                <span v-if="chat.user1 === $store.state.auth.user.id">
                  <b-img-lazy
                    v-if="chat.u2imageurl"
                    rounded="circle"
                    thumbnail
                    class="profile p-0 ml-1 mb-1 inline"
                    alt="Profile picture"
                    title="Profile"
                    :src="chat.u2imageurl"
                  />
                  <b-img-lazy
                    v-else
                    rounded="circle"
                    thumbnail
                    class="profile p-0 ml-1 mb-1 inline"
                    alt="Profile picture"
                    title="Profile"
                    src="~/static/placeholder.jpg"
                  />
                </span>
                <span class="pl-0 mb-0 chatname">
                  {{ chat.name }}
                </span>
                <span class="float-right small text-muted">
                  {{ $moment(chat.lastdate).fromNow() }}
                </span>
              </b-col>
            </b-row>
            <b-row>
              <b-col v-if="chat.chatmsg" class="pl-0 truncate">
                {{ chat.chatmsg }}
              </b-col>
              <b-col v-else class="pl-0">
                ...
              </b-col>
            </b-row>
          </li>
        </ul>
      </b-col>
      <b-col cols="6">
        <chatPane v-if="activeChat" :key="'activechat-' + (activeChat ? activeChat.id : null)" v-bind="activeChat" />
      </b-col>
      <b-col cols="3">
        Ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style>
.chatname {
  color: #000080;
  font-weight: bold;
}

.chatlist {
  max-height: calc(100vh - 58px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.chatsnippet {
  text-overflow: ellipsis;
}

.truncate {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
<script>
import chatPane from '~/components/chatPane.vue'

export default {
  components: {
    chatPane
  },

  data() {
    return {
      selectedChat: null
    }
  },

  computed: {
    sortedChats() {
      // We sort chats by unread first, then
      const chats = Object.values(this.$store.getters['chats/list']())

      chats.sort(function(a, b) {
        if (b.unseen !== a.unseen) {
          return b.unseen - a.unseen
        } else {
          return new Date(b.lastdate) - new Date(a.lastdate)
        }
      })

      return chats
    },

    activeChat() {
      // Selected chat if present, otherwise first chat if we have one.
      return this.selectedChat
        ? this.selectedChat
        : this.sortedChats
          ? this.sortedChats[0]
          : null
    }
  },

  async asyncData({ app, params, store }) {
    await store.dispatch('chats/listChats')

    const chats = store.getters['chats/list']()

    return {
      chats: chats
    }
  },
  methods: {}
}
</script>
