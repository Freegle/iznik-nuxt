<template>
  <NoticeMessage variant="danger">
    <p>
      <b-form-checkbox v-model="currentCovid" size="lg" class="d-inline" @change="$emit('update:covid', $event)" />
      I consider this item essential and will follow the guidance on safe freegling during COVID-19.
    </p>
    <b-btn variant="primary" @click="showModal = true">
      Read guidance on safe freegling
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
    covid: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      currentCovid: false
    }
  }
}
</script>
<style scoped>
</style>
