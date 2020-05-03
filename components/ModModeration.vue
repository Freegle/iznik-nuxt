<template>
  <b-select v-model="postingStatus" :options="options" class="d-inline sel" :size="size" @change="changed" />
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
          groupid: this.membership.groupid,
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
  },
  methods: {
    async changed(newval) {
      console.log('Set posting status to ', newval)
      await this.$store.dispatch('user/edit', {
        id: this.user.id,
        groupid: this.membership.id,
        ourPostingStatus: newval
      })
    }
  }
}
</script>
<style scoped>
.sel {
  max-width: 200px;
}
</style>
