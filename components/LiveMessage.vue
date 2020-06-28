<template>
  <b-card variant="white" class="text-enter width">
    <b-card-title>
      <span class="small">{{ message.message.subject }}</span>
    </b-card-title>
    <b-card-sub-title>
      On {{ message.group.namedisplay }}
    </b-card-sub-title>
  </b-card>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.width {
  margin-left: 150px;
  width: 300px;
}
</style>
