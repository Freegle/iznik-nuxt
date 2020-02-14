<template>
  <span>
    <b-img-lazy
      slot="img"
      center
      class="img-thumbnail square"
      :src="attachment.path"
      generator-unable-to-provide-required-alt=""
    />
    <!--    TODO Modal to zoom, rotate, delete-->
  </span>
</template>
<script>
export default {
  props: {
    attachment: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
.square {
  object-fit: cover;
  width: 200px;
  height: 200px;
}
</style>
