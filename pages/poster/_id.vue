<template>
  <div />
</template>
<script>
// Just redirect.
export default {
  data: function() {
    return {
      id: null
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.$router.push('/noticeboards/' + this.id)
  }
}
</script>
