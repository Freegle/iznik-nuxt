<template>
  <no-ssr>
    <div class="chatHolder">
      <b-row class="chatTitle">
        <b-col v-if="chat">
          <b-row>
            <b-col cols="6">
              <b-row>
                <b-col>
                  <span v-if="(chat.chattype == 'User2User' || chat.chattype == 'User2Mod')" class="d-inline">
                    <span @click="showInfo">
                      {{ chat.name }}
                    </span>
                  </span>
                  <span v-else class="d-inline">
                    {{ chat.name }}
                  </span>
                  <!--<span class="visible-xs-inline hidden-sm visible-md-inline hidden-lg js-ratings" />-->
                  <!--<span class="js-count badge badge-unread" style="display: none;"></span>-->
                  <!--&nbsp;-->
                  <fa icon="lock" title="This chat is private." class="d-inline" />
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="6">
              <!--<div class="dropdown pull-right">-->
              <!--<div class="btn btn-xs btn-white margright inline js-markread">-->
              <!--Mark read-->
              <!--</div>-->
              <!--<div class="js-popup clickme inline padleftlg hidden-xs hidden-sm" title="View this chat in a pop-up window">-->
              <!--<div class="glyphicon glyphicon-resize-full"/>-->
              <!--</div>-->
              <!--<% if (obj.chattype != 'Mod2Mod') { %>-->
              <!--<span class="glyphicon glyphicon-menu-down dropdown-toggle clickme" type="button" id="chat-dropdown-{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" />-->
              <!--<ul class="dropdown-menu" aria-labelledby="chat-dropdown-{{id}}">-->
              <!--<li title="Remove this conversation from your list."><a class="js-remove" href="#">Remove this chat</a></li>-->
              <!--<% if (obj.chattype == 'User2User') { %>-->
              <!--<li title="Block this person."><a class="js-block" href="#">Block this person</a></li>-->
              <!--<% } %>-->
              <!--<% if (!obj.group) { %>-->
              <!--<li title="Report this person to our volunteers."><a class="js-report" href="#">Report this person</a></li>-->
              <!--<% } %>-->
              <!--<li title="Enter inserts new line?"><a class="js-enter" href="#">Enter inserts new line?</a></li>-->
              <!--</ul>-->
              <!--<% } %>-->
              <!--</div>-->
              <b-btn variant="white" size="xs" class="float-right mt-1">
                Mark read
              </b-btn>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="chatContent">
        <b-col v-if="chat">
          <ul v-for="(chatmessage, $index) in chat.chatmessages" :key="'chatmessage-' + $index" class="p-0 pt-1 list-unstyled mb-1">
            <li>
              <b-row>
                <b-col>
                  <div v-if="chatmessage.userid != $store.state.auth.user.id">
                    <b-img-lazy
                      rounded="circle"
                      thumbnail
                      class="profile p-0 ml-1 mb-1 inline"
                      alt="Profile picture"
                      title="Profile"
                      :src="chat.chatusers[chatmessage.userid].profile.turl"
                    />
                    <span class="chatMessage">
                      {{ chatmessage.message }}
                    </span>
                  </div>
                  <div v-else class="float-right">
                    <span class="chatMessage">
                      {{ chatmessage.message }}
                    </span>
                    <b-img-lazy
                      rounded="circle"
                      thumbnail
                      class="profile p-0 ml-1 mb-1 inline"
                      alt="Profile picture"
                      title="Profile"
                      :src="chat.chatusers[chatmessage.userid].profile.turl"
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
            </li>
          </ul>
        </b-col>
      </b-row>
      <div class="chatFooter">
        <b-row>
          <b-col class="p-0">
            <b-form-textarea
              placeholder="Type here..."
              rows="3"
              max-rows="8"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="p-0 pt-1 pb-1">
            <ratings v-if="otheruser" :key="'otheruser-' + (otheruser ? otheruser.id : null)" v-bind="otheruser" />
            <b-btn variant="white">
              <fa icon="handshake" />&nbsp;Promise
            </b-btn>
            <b-btn variant="white">
              <fa icon="address-book" />&nbsp;Address
            </b-btn>
            <b-btn variant="white">
              <fa icon="calendar" />&nbsp;Calendar
            </b-btn>
            <b-btn variant="white">
              <fa icon="info-circle" />&nbsp;Info
            </b-btn>
            <b-btn variant="white">
              <fa icon="bell" />&nbsp;Nudge
            </b-btn>
            <b-btn variant="primary" class="float-right">
              Send&nbsp;&gt;
            </b-btn>
          </b-col>
        </b-row>
      </div>
    </div>
  </no-ssr>
</template>
<style>
.chatpane {
  min-height: 100vh;
}

.chatHolder {
  height: calc(100vh - 74px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chatTitle {
  background-color: #4895dd;
  color: white;
  font-weight: bold;
  order: 1;
}

.chatWarning {
  order: 2;
  justify-content: flex-start;
}

.chatContent {
  order: 3;
  justify-content: flex-start;
  flex-grow: 1;
  overflow-y: scroll;
}

.chatFooter {
  order: 4;
  justify-content: flex-end;
}
</style>
<script>
import ratings from '~/components/ratings'

export default {
  components: {
    ratings
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      chat: null
    }
  },
  computed: {
    otheruser() {
      // The user who isn't us.
      if (this.chat) {
        return this.chat.user1 &&
          this.chat.user1.id === this.$store.state.auth.user.id
          ? this.chat.user2
          : this.chat.user1
      } else {
        return null
      }
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('chats/fetch', {
      id: this.id
    })

    const chat = this.$store.getters['chats/get'](this.id)
    this.chat = chat
  },
  methods: {
    showInfo() {
      console.log('Show info')
    }
  }
}
</script>
