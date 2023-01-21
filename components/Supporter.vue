<template>
  <div
    :class="{
      hidden: hidden
    }"
  >
    <b-badge
      variant="primary rounded supporter"
      :class="'clickme ' + 'size-' + size"
      title="Kindly supports Freegle - click for more info."
      @click="showModal"
    >
      <v-icon name="heart" />
      Supporter
    </b-badge>
    <SupporterInfoModal ref="modal" />
  </div>
</template>
<script>
import SupporterInfoModal from '~/components/SupporterInfoModal'
export default {
  components: { SupporterInfoModal },
  props: {
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    hidden: {
      type: Boolean,
      required: false,
      default: false
    }
  },
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

.size-lg {
  font-size: 1.25rem;
}

.hidden {
  opacity: 0.5;
}
</style>
