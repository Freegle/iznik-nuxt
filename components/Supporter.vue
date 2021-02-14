<template>
  <div>
    <b-badge variant="primary rounded supporter" class="clickme" @click="showModal">
      <v-icon name="heart" />
      Supporter
    </b-badge>
    <SupporterInfoModal ref="modal" />
  </div>
</template>
<script>
import SupporterInfoModal from '@/components/SupporterInfoModal'
export default {
  components: { SupporterInfoModal },
  props: {},
  methods: {
    showModal(e) {
      this.$refs.modal.show()
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.supporter {
  color: white;
  background-color: $color-gold;
}
</style>
