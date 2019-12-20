<template>
  <client-only>
    <Icon :name="name" :scale="scale" />
  </client-only>
</template>
<script>
import Icon from 'vue-awesome/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    name: {
      type: String,
      required: true
    },
    scale: {
      type: String,
      required: false,
      default: '1'
    }
  }
}
</script>
