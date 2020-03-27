<template>
  <div>
    TODO
    <GroupSelect v-model="groupid" modonly />
  </div>
</template>
<script>
import GroupSelect from './GroupSelect'

export default {
  components: { GroupSelect },
  data: function() {
    return {
      groupid: null
    }
  },
  computed: {}
}
</script>
<style scoped lang="scss">
@import 'color-vars';

input {
  max-width: 300px;
}
</style>
