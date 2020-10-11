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
