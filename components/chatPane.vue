<template>
  <no-ssr>
    <div>
      <b-row>
        <b-col v-if="chat">
          <b-row class="chatTitle">
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
      <b-row>
        <b-col v-if="chat">
          <ul v-for="(chatmessage, $index) in chat.chatmessages" :key="'chatmessage-' + $index" class="p-0 list-unstyled mb-1">
            <li>
              {{ chatmessage.message }}
            </li>
          </ul>
        </b-col>
      </b-row>
    </div>
  </no-ssr>
</template>
<style>
.chatpane {
  min-height: 100vh;
}

.chatTitle {
  background-color: #4895dd;
  color: white;
  font-weight: bold;
}
</style>
<script>
export default {
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
