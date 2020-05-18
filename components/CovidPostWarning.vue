<template>
  <NoticeMessage variant="danger">
    Please read our guidance on
    <b-btn variant="link" class="p-0 align-top" @click="showModal = true">
      safe freegling
    </b-btn>
    during COVID-19.
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
      showModal: false
    }
  }
}
</script>
