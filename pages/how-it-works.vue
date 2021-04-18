<template>
  <div class="w-100 d-flex justify-content-center text-center">
    <b-img-lazy src="~/static/loader.gif" alt="Loading" />
  </div>
</template>
<script>
export default {
  // Lega
  mounted() {
    this.$router.push('/')
  }
}
</script>
