<template>
  <div>
    <Shortlink v-for="shortlink in shortlinks" :key="'shortlink-' + shortlink.id" :shortlink="shortlink" class="bg-white m-0" />
  </div>
</template>
<script>
import Shortlink from './Shortlink'
export default {
  components: { Shortlink },
  props: {
    shortlinks: {
      type: Array,
      required: true
    }
  }
}
</script>
