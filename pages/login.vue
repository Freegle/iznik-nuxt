<template>
  <form>
    <p class="h4 offset-sm-1">
      Please log in
    </p>
    <b-row>
      <b-col offset-sm="1" xs="12" lg="3">
        <b-form-group
          id="fieldsetHorizontal"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Email"
          label-for="email"
        >
          <b-form-input ref="email" v-model="email" placeholder="Your email address" alt="Email address" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col offset-sm="1" xs="12" lg="3">
        <b-form-group
          id="fieldsetHorizontal"
          label-cols-sm="4"
          label-cols-lg="3"
          label="Password"
          label-for="password"
        >
          <b-form-input ref="password" v-model="password" type="password" placeholder="Your password" alt="Password" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col offset-sm="1" xs="12" lg="3">
        <b-btn v-b-modal.add variant="success" class="mb-2 mt-2" @click="login()">
          Login
        </b-btn>
      </b-col>
    </b-row>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      rememberme: false,
      error: null
    }
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters['security/isAuthenticated']
    }
  },

  methods: {
    async login() {
      await this.$auth
        .loginWith('native', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        .then(() => {
          // Return to the page, which will re-render now we're logged in.
          console.log('Logged in')
          this.$router.back()
        })
        .catch(e => {
          console.error('Failed login', e)
          // TODO
        })
    }
  }
}
</script>
