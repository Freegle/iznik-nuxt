<template>
  <b-modal
    id="emailConfirmModal"
    ref="emailConfirmModal"
    v-model="showModal"
    title="Please check your mailbox"
    no-stacking
    size="lg"
  >
    <p>We've sent you a verification mail.</p>
    <p>Don't forget to check your spam folder!</p>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="primary" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import modal from '@/mixins/modal'

export default {
  mixins: [modal]
}
</script>
