<template>
  <NoticeMessage v-if="show" variant="danger">
    <b-btn variant="link" class="float-right" @click="hideit">
      Hide this
    </b-btn>
    <p>
      <b>Very sadly, Freegle has suspended people collecting items due to COVID-19.</b>
    </p>
    <p>
      But you can still offer your stuff and we'll let people know about it when we re-open.  That way you can declutter
      while you're stuck at home.  Don't mope and mutter, just de-clutter!
    </p>
    <b-btn variant="success" size="lg" to="/give" class="mb-2">
      <v-icon name="gift" />&nbsp;Give Stuff
    </b-btn>
    <p>
      We’ll email you
      when we’re back.  There will be
      a lot of people who are struggling and will need things then.
    </p>
    <p>
      Freegle also needs your help.  We are funded mostly from donations given by freeglers - no freegling means we
      won’t be getting donations.  Lots of charities and businesses will be struggling, but if you want us to
      be here for you in six months’ time then please set up a regular donation:

      <DonationButton link="paypal1" show="£1/month" monthly class="mt-2" />
    </p>
    <div v-if="$route.path !== '/chitchat'">
      <p>
        Our <nuxt-link to="/chitchat">
          ChitChat section
        </nuxt-link> is staying open.  Join us here to swap hints,
        tips and tell others how you’re filling your day.  Share your knowledge and questions on upcycling, reuse,
        crafts, gardening, cooking, hobbies etc.
      </p>
      <b-btn to="/chitchat" variant="white" size="lg" class="mb-2">
        Join us on ChitChat <v-icon name="angle-double-right" />
      </b-btn>
    </div>
    <p>
      See you on the other side!
    </p>
  </NoticeMessage>
  <div v-else class="text-danger text-right clickme" @click="showit">
    Show COVID-19 warning.
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import DonationButton from './DonationButton'
export default {
  components: { DonationButton, NoticeMessage },
  computed: {
    show() {
      return !this.$store.getters['misc/get']('hidecovidwarning')
    }
  },
  methods: {
    hideit() {
      this.$store.dispatch('misc/set', {
        key: 'hidecovidwarning',
        value: true
      })
    },
    showit() {
      this.$store.dispatch('misc/set', {
        key: 'hidecovidwarning',
        value: false
      })
    }
  }
}
</script>
