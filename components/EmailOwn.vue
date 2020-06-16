<template>
  <div class="d-flex justify-content-between">
    <em class="pt-2">{{ email.email }}</em>
    <b-btn variant="link" class="align-baseline" @click="deleteIt">
      Remove
    </b-btn>
  </div>
</template>
<script>
export default {
  props: {
    email: {
      type: Object,
      required: true
    }
  },
  methods: {
    async deleteIt() {
      await this.$store.dispatch('user/removeEmail', {
        id: this.myid,
        email: this.email.email
      })

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme', 'phone', 'notifications'],
        force: true
      })
    }
  }
}
</script>
