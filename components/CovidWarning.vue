<template>
  <NoticeMessage variant="warning">
    <p>
      Most Freegle communities are now open, though some may have restrictions or remain closed based on the local
      situation.  Please freegle responsibly.
    </p>
    <p>
      <b-btn variant="link" class="p-0" @click="showModal = true">
        Read our advice on safe freegling
      </b-btn>
    </p>
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
