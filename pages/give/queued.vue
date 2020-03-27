<template>
  <div>
    <div v-if="newuser">
      <NewUser :password="newpassword" />
    </div>
    <div v-else>
      <b-row class="m-0">
        <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
          <h1 class="text-center">
            Thanks for freegling!
          </h1>
          <p>
            We've queued your OFFER up for when things settle down a bit.  You
            can find it in My Posts.
          </p>
          <p>
            Thanks for keeping us going during these difficult times for everyone. We are funded mostly from
            donations given by freeglers - no freegling means we
            won’t be getting donations.  Lots of charities and businesses will be struggling, but if you want us to
            be here for you in six months’ time then please set up a regular donation:
          </p>
          <div class="d-flex justify-content-around text-center mt-2 mb-3">
            <DonationButton link="paypal1" show="£1/month" monthly />
          </div>
          <div class="d-flex justify-content-between flex-wrap">
            <b-btn size="lg" variant="success" to="/give/whatisit">
              <v-icon name="gift" />&nbsp;Give something else
            </b-btn>
            <b-btn variant="white" size="lg" to="/myposts">
              My Posts <v-icon name="angle-double-right" />
            </b-btn>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<style lang="scss">
@import 'color-vars';

.tooltip-inner {
  background-color: $color-white;
  color: $color-black;
  border: 1px $color-black solid;
}
.arrow {
  background-color: transparent;
  color: $color-white;
}
</style>

<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import DonationButton from '../../components/DonationButton'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
Vue.use(TooltipPlugin)

const NewUser = () => import('~/components/NewUser.vue')

export default {
  components: {
    DonationButton,
    NewUser
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      show: true,
      newuser: false,
      newpassword: null
    }
  },
  computed: {
    group() {
      const groupid = this.$store.getters['compose/getGroup']
      const group = this.$store.getters['group/get'](groupid)
      return group
    }
  },
  mounted: function() {
    // Fade out tooltip after a while
    setTimeout(() => (this.show = false), 10000)
    this.newuser = this.$route.params.newuser
    this.newpassword = this.$route.params.newpassword
  },
  methods: {
    availability() {
      this.$refs.availabilitymodal.show()
    }
  },

  head() {
    return this.buildHead('Success', 'Your OFFER has been posted')
  }
}
</script>
