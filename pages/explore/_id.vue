<template>
  <div>
    <h1>Group {{ id }}</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: null
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
