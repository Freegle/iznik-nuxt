<template>
  <NoticeMessage variant="danger">
    <p>Before we go further, please complete our "COVID checklist" to show that you'll help keep yourself and others safe.</p>
    <b-form-checkbox v-model="socialdistance" size="lg">
      <label>
        I will respect social distance.
      </label>
    </b-form-checkbox>
    <b-form-checkbox v-model="travel" size="lg">
      <label>
        I will follow rules on permitted travel.
      </label>
    </b-form-checkbox>
    <b-form-checkbox v-model="clean" size="lg">
      <label>
        I will clean items I give or receive.
      </label>
    </b-form-checkbox>
    <p class="mt-2">
      If you're not comfortable, don't freegle.  You can also read more advice here:
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
  methods: {
    check() {
      if (this.socialdistance && this.travel && this.clean) {
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
