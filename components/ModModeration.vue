<template>
  <b-select v-model="postingStatus" :options="options" class="d-inline sel" :size="size" />
</template>
<script>
export default {
  props: {
    membership: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    }
  },
  computed: {
    postingStatus: {
      get() {
        return this.membership.ourpostingstatus || 'MODERATED'
      },
      async set(val) {
        await this.$store.dispatch('user/edit', {
          id: this.user.id,
          groupid: this.membership.id,
          ourPostingStatus: val
        })
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
        },
        {
          value: 'PROHIBITED',
          text: "Can't Post"
        }
      ]
    }
  }
}
</script>
<style scoped>
.sel {
  max-width: 200px;
}
</style>
