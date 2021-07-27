<template>
  <div>
    <client-only>
      <p class="text-danger">
        The website will be offline for some of the morning of Thursday 29th July for a database upgrade.
        We'd ask you to cross your fingers, except that makes it hard to type.
      </p>
      <NoticeMessage v-if="show" variant="danger">
        <b-btn variant="link" class="float-right" @click="hideit">
          Hide this
        </b-btn>
        <p>
          We hope you and yours are safe.  Please freegle responsibly and help keep it that way.  Respect local
          rules and lockdowns.
        </p>
        <b-btn variant="link" @click="showModal = true">
          Read our advice on safe freegling
        </b-btn>
        <b-modal v-model="showModal" ok-only size="lg" title="Safe Freegling" ok-title="Close">
          <CovidSafeFreegling />
        </b-modal>
      </NoticeMessage>
      <div v-else class="text-danger text-right clickme" @click="showit">
        Show COVID-19 warning.
      </div>
    </client-only>
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
