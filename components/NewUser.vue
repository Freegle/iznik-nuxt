<template>
  <div>
    <h1 class="text-center">
      Welcome to Freegle!
    </h1>
    <b-row class="text-center">
      <b-col cols="12" md="6" offset-md="3">
        <NewUserInfo :password="password" />
      </b-col>
    </b-row>
    <h3 class="text-center mt-2">
      What happens next?
    </h3>
    <b-row class="text-center">
      <b-col cols="12" md="6" offset-md="3">
        <ul class="list-unstyled">
          <li>
            1. You'll get replies by email and in the <nuxt-link to="/chats">
              Chats
            </nuxt-link> section on here.
          </li>
          <li>
            2. <b>Check your spam folder</b> and in Chats - email doesn't always get through.
          </li>
          <li>
            3. You can manage your posts from <nuxt-link to="/myposts">
              My Posts
            </nuxt-link>.
          </li>
          <li>
            4. You can browse other freeglers' posts in <nuxt-link to="/browse">
              Browse
            </nuxt-link>.
          </li>
        </ul>
        <b-btn variant="primary" size="lg" to="/browse">
          <v-icon name="eye" />&nbsp;
          Continue to Browse posts
        </b-btn>
      </b-col>
    </b-row>
    <p class="mt-2 text-center">
      You can change settings, such as how often we mail you, or the name other freeglers will see for you:
    </p>
    <b-row class="text-center">
      <b-col cols="12" md="6" offset-md="3">
        <b-btn variant="white" size="lg" to="/settings">
          <v-icon name="cog" />&nbsp;
          Change Settings
        </b-btn>
      </b-col>
    </b-row>
    <b-tooltip
      v-if="showToolTip < tooltips.length"
      :key="showToolTip"
      :show="showToolTip < tooltips.length"
      :target="tooltips[showToolTip].option"
      class="d-none d-md-block"
      offset="50%"
      triggers=""
    >
      <br>
      <!-- eslint-disable-next-line-->
      <span v-html="tooltips[showToolTip].content" />
      <br>
      <b-btn variant="primary" class="mt-4" @click="nextTooltip">
        Next tip <v-icon name="angle-double-right" />
      </b-btn>
    </b-tooltip>
    <div class="tooltip d-none" />
  </div>
</template>
<style scoped>
</style>
<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import NewUserInfo from './NewUserInfo'
Vue.use(TooltipPlugin)

export default {
  components: { NewUserInfo },
  props: {
    password: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      timer: null,
      showToolTip: 0,
      tooltips: [
        {
          option: 'menu-option-chat',
          content:
            'Replies will appear here<br><br>\n' +
            '\n' +
            '      You\'ll also get them by email.  <span class="text-danger font-weight-bold">Check your spam!</span>'
        },
        {
          option: 'menu-option-chitchat',
          content: 'Chat to other freeglers here.'
        },
        {
          option: 'menu-option-myposts',
          content: 'You can manage your posts from here.'
        },
        {
          option: 'menu-option-mygroups',
          content: 'Browse posts from other freeglers here.'
        }
      ]
    }
  },
  mounted() {
    // We should now be logged in - pick that up.
    this.$store.dispatch('auth/fetchUser', {
      components: ['me', 'groups']
    })

    this.timer = setTimeout(this.toolTipTimer, 15000)
  },
  methods: {
    nextTooltip() {
      if (this.timer) {
        console.log('Timer', this.timer)
        clearTimeout(this.timer)
        this.timer = null
      }

      this.showToolTip++
    },
    toolTipTimer() {
      this.showToolTip++
      if (this.showToolTip < this.tooltips.length) {
        setTimeout(this.toolTipTimer, 15000)
      }
    }
  }
}
</script>
