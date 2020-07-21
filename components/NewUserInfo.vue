<template>
  <div>
    <p class="text-center">
      It looks like this is your first time freegling.  Hello!
    </p>
    <b-card variant="white">
      <h2 class="text-center">
        Your Account Password
      </h2>
      <p class="text-center">
        We've emailed a password to you:
      </p>
      <div class="d-flex justify-content-around">
        <b-card variant="white">
          <h1 class="text-primary">
            <span class="large">
              {{ password }}
            </span>
          </h1>
        </b-card>
      </div>
      <p class="text-center mt-2">
        ...or you can set your own:
      </p>
      <div class="d-flex justify-content-around">
        <b-input-group>
          <b-form-input v-model="newPassword" type="password" />
          <b-input-group-append>
            <SpinButton variant="primary" :handler="setPassword" name="save" label="Save" />
          </b-input-group-append>
        </b-input-group>
      </div>
      <p class="mt-2 text-center">
        When you come back to us you can also log in your Facebook, Google or Yahoo account for that email address.
      </p>
    </b-card>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
export default {
  components: { SpinButton },
  props: {
    password: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      newPassword: null
    }
  },
  methods: {
    async setPassword() {
      this.savingPassword = true

      if (this.newPassword) {
        this.me = await this.$store.dispatch('auth/saveAndGet', {
          password: this.newPassword
        })
      }

      this.savingPassword = false
      this.savedPassword = true
      setTimeout(() => {
        this.savedPassword = false
      }, 2000)
    }
  }
}
</script>
