<template>
  <NoticeMessage v-if="show" variant="danger">
    <p>Before we go further, please complete our "COVID checklist" to show that you'll help keep yourself and others safe.</p>
    <b-form-checkbox v-model="travel" size="lg">
      <b>
        I will follow local rules on permitted and essential travel, leaving my home and travelling between areas.
      </b>
    </b-form-checkbox>
    <b-form-checkbox v-model="socialdistance" size="lg">
      <b>
        I will respect social distance.
      </b>
    </b-form-checkbox>
    <b-form-checkbox v-model="clean" size="lg">
      <b>
        I will clean items I give or receive.
      </b>
    </b-form-checkbox>
    <p class="mt-2">
      We really really recommend that you only travel for freegling as part of another journey or permitted exercise, and
      that you do not enter someone else's home.  If you're not comfortable, don't freegle.  You can also read more
      advice here:
    </p>
    <b-btn variant="link" class="p-0 align-top" @click="showModal = true">
      Read about safe freegling
    </b-btn>
    <b-modal v-model="showModal" ok-only size="lg" title="Safe Freegling" ok-title="Close">
      <CovidSafeFreegling />
    </b-modal>
  </NoticeMessage>
</template>

<script>
import NoticeMessage from './NoticeMessage'
import CovidSafeFreegling from './CovidSafeFreegling'

export default {
  components: { CovidSafeFreegling, NoticeMessage },
  data: function() {
    return {
      show: false,
      showModal: false,
      socialdistance: false,
      travel: false,
      clean: false
    }
  },
  watch: {
    socialdistance() {
      this.check()
    },
    travel() {
      this.check()
    },
    clean() {
      this.check()
    }
  },
  mounted() {
    const last = this.$store.getters['misc/get']('covidconfirmed')

    // If we've asked within the last day, just continue.
    if (last && Date.now() - last <= 24 * 60 * 60 * 1000) {
      this.$emit('confirmed')
    } else {
      this.show = true
    }
  },
  methods: {
    check() {
      if (this.socialdistance && this.travel && this.clean) {
        this.$store.dispatch('misc/set', {
          key: 'covidconfirmed',
          value: Date.now()
        })

        this.$emit('confirmed')
      }
    }
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
}
</style>
