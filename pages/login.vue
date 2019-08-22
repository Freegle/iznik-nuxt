<template>
  <!-- Default form login -->
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
          <b-form-input id="email" v-model="email" placeholder="Enter your email" />
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
          <b-form-input id="password" v-model="password" type="password" placeholder="Enter your password" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col offset-sm="1" xs="12" lg="3">
        <b-form-checkbox v-model="rememberme" value="true" unchecked-value="false">
          Remember me
        </b-form-checkbox>
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
  <!-- Default form login -->
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
    login() {
      console.log('Do login')
      this.$store
        .dispatch('security/login', {
          email: this.email,
          password: this.password,
          rememberme: this.rememberme
        })
        .then(() => {
          console.log('Login complete')
          // TODO Move to the grid page.
          this.$router.push({
            path: '/'
          })
          console.log('Pushed')
        })
        .catch(() => {
          // TODO
        })
    }
  }
}
</script>
