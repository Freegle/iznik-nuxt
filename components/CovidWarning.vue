<template>
  <NoticeMessage v-if="show" variant="danger">
    <b-btn variant="link" class="float-right" @click="hideit">
      Hide this
    </b-btn>
    <p>
      <b>COVID-19 is serious - don't freegle unless it's essential.  Please offer essential things others
        might need.</b>
    </p>
    <p />
    <p>
      The virus lasts on surfaces - probably a few hours on cardboard, longer on metal.
      Keep safe distances.  Wear gloves.  Wipe down items (degreasing kitchen cleaner is good).  Wash your hands.
    </p>
    <p>
      We're doing our bit to provide practical help.  You can too.  <nuxt-link to="/covid">
        Find out more
      </nuxt-link>
    </p>
    <p>
      Like many people, charities and businesses, Freegle will struggle.  We don't
      get government help.  If you can, please help make sure we're here for you in six months:
    </p>
    <DonationButton link="paypal1" show="£1/month" monthly />
  </NoticeMessage>
  <div v-else class="text-danger float-right clickme" @click="showit">
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
      return this.$store.getters['misc/get']('covidwarning')
    }
  },
  methods: {
    hideit() {
      this.$store.dispatch('misc/set', {
        key: 'covidwarning',
        value: false
      })
    },
    showit() {
      this.$store.dispatch('misc/set', {
        key: 'covidwarning',
        value: true
      })
    }
  }
}
</script>
