<template>
  <div>
    <NoticeMessage v-if="show" variant="danger">
      <b-btn variant="link" class="float-right" @click="hideit">
        Hide this
      </b-btn>
      <p>
        We hope you and yours are safe.  Please freegle responsibly and help keep it that way.  Respect local
        rules and lockdowns.
      </p>
      <b-btn variant="secondary" @click="showModal = true">
        Read our advice on safe freegling
      </b-btn>
      <b-modal v-model="showModal" ok-only size="lg" title="Safe Freegling" ok-title="Close">
        <CovidSafeFreegling />
      </b-modal>
    </NoticeMessage>
    <div v-else class="text-danger text-right clickme" @click="showit">
      Show COVID-19 warning.
    </div>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import CovidSafeFreegling from './CovidSafeFreegling'

export default {
  components: { CovidSafeFreegling, NoticeMessage },
  data: function() {
    return {
      showModal: false
    }
  },
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
