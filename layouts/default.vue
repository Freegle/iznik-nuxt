<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="ourBack">
      <b-navbar-brand to="/" class="p-0">
        <b-img class="logo" fluid rounded :src="require(`@/static/icon.png`)" alt="Home" />
      </b-navbar-brand>
      <!--<b-navbar-toggle v-if="loggedIn" target="nav_collapse" />-->

      <!--<b-collapse v-if="loggedIn" id="nav_collapse" is-nav>-->
      <!--<b-navbar-nav />-->

      <!--<b-navbar-nav class="ml-auto" />-->
      <!--</b-collapse>-->
      <ul class="navbar-nav mr-auto" />
      <ul class="nav navbar-nav navbar-right">
        <li>
          <b-button class="btn-white" @click="signIn">
            Sign in
          </b-button>
        </li>
      </ul>
    </b-navbar>
    <nuxt class="ml-0" />
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.ourBack {
  background-color: #61ae24 !important;
}

nav .navbar-nav li a {
  color: #cdcdcd !important;
}

nav .navbar-nav li a.nuxt-link-active {
  color: white !important;
}

.navbar-brand a {
  color: white !important;
}

.navbar a.navbar-brand {
  padding: 0px;
}

.navbar .logo {
  width: 58px !important;
  padding: 0px;
  margin-top: -5px;
  margin-bottom: -5px;
}
</style>

<script>
export default {
  components: {},
  computed: {
    loggedIn() {
      // We only show the menu if we are logged in, or if we're not yet sure.  The latter prevents flicker when
      // switching pages and logged in.
      return (
        this.$store.state.security.isLoading ||
        this.$store.state.security.isAuthenticated
      )
    }
  },

  methods: {
    signIn() {
      console.log('Sign in')
    },
    logout() {
      this.$store.dispatch('security/logout').then(() => {
        this.$router.push({
          path: '/login'
        })
      })
    }
  }
}
</script>
