<template>
  <!-- Default form login -->
  <form>
    <p class="h4 offset-sm-1">
      Please login
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
        <b-btn v-b-modal.add variant="success" class="mb-2 mt-2" @click="postLogin()">
          Login
        </b-btn>
      </b-col>
    </b-row>
  </form>
  <!-- Default form login -->
</template>

<script>
export default {
  middleware: 'notAuthenticated',

  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },

  methods: {
    postLogin() {
      this.$store
        .dispatch('session/login', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          console.log('Displatched login, route', this.$store.state)
          this.$router.push({
            path: '/locations'
          })
        })
    }
  }
}
</script>
