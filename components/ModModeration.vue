<template>
  <b-select v-model="postingStatus" :options="options" class="d-inline sel" disabled />
</template>
<script>
export default {
  props: {
    membership: {
      type: Object,
      required: true
    }
  },
  computed: {
    postingStatus: {
      get() {
        return this.membership.ourpostingstatus || 'MODERATED'
      },
      set(val) {
        // TODO
      }
    },
    options() {
      return [
        {
          value: 'MODERATED',
          text: 'Moderated'
        },
        {
          value: 'DEFAULT',
          text: 'Group Settings'
        }
      ]
    }
  },
  methods: {}
}
</script>
<style scoped>
.sel {
  max-width: 200px;
}
</style>
