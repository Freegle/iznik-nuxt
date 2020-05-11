<template>
  <NoticeMessage variant="danger">
    <p>
      <b-form-checkbox v-model="currentCovid" size="lg" class="d-inline blah" @change="$emit('update:covid', $event)" />
      &lt;--- Click here to say you consider this item essential and will follow the guidance on safe freegling during COVID-19.
    </p>
    <b-btn variant="primary" @click="showModal = true">
      Read guidance on safe freegling
    </b-btn>
    <b-modal v-model="showModal" ok-only size="lg" title="Safe Freegling" ok-title="Close">
      <CovidSafeFreegling />
    </b-modal>
    <span class="d-none custom-control-label" />
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
  },
  computed: {
    pulse() {
      return this.currentCovid
        ? ''
        : 'pulsate check border border-success rounded '
    }
  }
}
</script>
<style scoped>
.check {
  border-width: 3px !important;
}

::v-deep .check .custom-control-label::before {
  left: -1.6rem !important;
}

::v-deep .custom-control-label::before {
  width: 2rem !important;
  height: 2rem !important;
}

::v-deep .custom-control-label::after {
  width: 2rem !important;
  height: 2rem !important;
}

::v-deep .custom-checkbox.b-custom-control-lg {
  line-height: 2.3;
}
</style>
