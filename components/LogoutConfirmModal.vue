<template>
  <b-modal
    id="logoutConfirmModal"
    ref="logoutConfirmModal"
    v-model="showModal"
    title="Are you sure that you want to logout?"
    no-stacking
    size="lg"
  >
    <template slot="modal-footer" slot-scope="{ Logout, cancel }">
      <b-button variant="primary" @click="logout">
        Logout
      </b-button>
      <b-button variant="primary" @click="cancel">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  data: function() {
    return {
      showModal: false
    }
  },

  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async logout() {
      try {
        this.$cookies.removeAll()
      } catch (e) {}

      await this.$store.dispatch('auth/logout')
      this.$store.dispatch('auth/forceLogin', false)

      // Go to the landing page.
      this.$router.push('/')
    }
  }
}
</script>
