<template>
  <NoticeMessage v-if="show" variant="danger">
    <p>Before we go further, please complete our "COVID checklist" to show that you'll help keep yourself and others safe.</p>
    <b-form-checkbox v-model="travel" size="lg">
      <strong>
        I will follow rules on leaving my home, essential travel and staying local.
      </strong>
    </b-form-checkbox>
    <p class="mt-3">
      When freegling:
    </p>
    <b-form-checkbox v-model="socialdistance" size="lg">
      <strong>
        I will maintain social distance and wear a face covering unless medically exempt.
      </strong>
    </b-form-checkbox>
    <b-form-checkbox v-model="clean" size="lg">
      <strong>
        I will clean items I give or receive.
      </strong>
    </b-form-checkbox>
    <b-form-checkbox v-model="enter" size="lg">
      <strong>
        I will not enter anyone else's home or allow anyone into mine.
      </strong>
    </b-form-checkbox>
    <p class="mt-2">
      If you're not comfortable, don't freegle - or consider delaying handovers until restrictions ease.  You can also read more
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
  props: {
    force: {
      type: Boolean,
      required: false,
      default: false
    },
    msgid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      show: false,
      showModal: false,
      socialdistance: false,
      travel: false,
      clean: false,
      enter: false
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
    },
    enter() {
      this.check()
    }
  },
  mounted() {
    const last = this.$store.getters['misc/get']('covidconfirmed')

    // If we've asked within the last day, just continue.
    if (!this.force && last && Date.now() - last <= 24 * 60 * 60 * 1000) {
      this.$emit('confirmed')
    } else {
      this.show = true
    }
  },
  methods: {
    async check() {
      if (this.socialdistance && this.travel && this.clean && this.enter) {
        await this.$store.dispatch('misc/set', {
          key: 'covidconfirmed',
          value: Date.now()
        })

        await this.$store.dispatch('auth/covidConfirm', {
          msgid: this.msgid
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
