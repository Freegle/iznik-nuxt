<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="3" class="chatlist p-0">
        <ul v-for="(chat, $index) in sortedChats" :key="'chat-' + $index" class="p-0 pt-1 list-unstyled mb-1">
          <li :class="{ active: activeChat && chat.id == activeChat.id }">
            <nuxt-link :to="'/chats/' + chat.id" class="nodecor">
              <b-row class="ml-1 mr-1">
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
                  <span v-if="chat.unseen">
                    <b-badge variant="danger">{{ chat.unseen }}</b-badge>
                  </span>
                  <span class="float-right small text-muted">
                    {{ $moment(chat.lastdate).fromNow() }}
                  </span>
                </b-col>
              </b-row>
              <b-row>
                <b-col v-if="chat.chatmsg" class="pl-4 truncate">
                  {{ chat.chatmsg }}
                </b-col>
                <b-col v-else class="pl-4">
                  ...
                </b-col>
              </b-row>
            </nuxt-link>
          </li>
        </ul>
      </b-col>
      <b-col cols="6" class="chatback">
        <chatPane v-if="activeChat" :key="'activechat-' + (activeChat ? activeChat.id : null)" v-bind="activeChat" />
      </b-col>
      <b-col cols="3">
        Ads go here
      </b-col>
    </b-row>
  </b-col>
</template>
<style>
.chatback {
  background-color: #f3f0da;
}

.active {
  background-color: rgb(245, 245, 245);
}
</style>
<script>
import chatPane from '~/components/chatPane.vue'

export default {
  components: {
    chatPane
  },

  validate({ params }) {
    // Must be a number if present
    return !params.id || /^\d+$/.test(params.id)
  },

  data() {
    return {
      id: null
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

    const chats = Object.values(store.getters['chats/list']())

    let selected = null

    if (params.id) {
      selected = chats.find(chat => parseInt(chat.id) === parseInt(params.id))
    }

    return {
      chats: chats,
      selectedChat: selected
    }
  },

  created() {
    this.id = this.$route.params.id
  },
  methods: {}
}
</script>
