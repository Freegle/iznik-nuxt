<template>
  <b-img lazy :src="paththumb" rounded thumbnail class="imagepreview" />
</template>
<style scoped>
.imagepreview {
  width: 150px;
}
</style>
<script>
// TODO Rotate and delete
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    paththumb: {
      type: String,
      required: true
    }
  }
}
</script>
