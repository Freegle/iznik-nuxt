<template>
  <b-row>
    <b-col class="text-center">
      <b-img-lazy src="~/static/loader.gif" alt="Loading" />
    </b-col>
  </b-row>
</template>
<script>
export default {
  mounted() {
    // We have been redirected here after an attempt to sign in with Yahoo from LoginModal.  We should have two
    // url parameters - returnto which we set up, and code which is returned by Yahoo after a successful login
    console.log('Yahoologin mounted')

    const returnto = this.$route.query.returnto
    console.log('Return to', returnto)

    const code = this.$route.query.code
    console.log('Auth code', code)

    const self = this

    if (self.me) {
      // We are logged in.  Go back to where we want to be.
      console.log('Already logged in')
      if (returnto) {
        // Go where we want to be.  Make sure we remove the code to avoid us trying to log in again.
        console.log('Return to', returnto)
        self.$router.push(returnto)
      } else {
        console.log('Just go home')
        self.$router.push('/')
      }
    } else if (!code) {
      // Probably they rejected our authorisation.  Just go back to the same page we were at.
      console.log('No code found, return to', returnto)
      window.location = returnto
    } else {
      // We have a code.  Use it on the server to log ion.
      self.$axios
        .post(process.env.API + '/session', {
          yahoocodelogin: code
        })
        .then(async function(result) {
          const ret = result.data
          console.log('Yahoologin session login returned', ret)
          if (ret.ret === 0) {
            // Set the user to store the persistent token.
            ret.user.persistent = ret.persistent
            self.$store.dispatch('auth/setUser', ret.user)

            // We are logged in.  Get the logged in user
            console.log('Logged in')
            await self.fetchMe(['me', 'groups'], true)

            self.pleaseLogin = false

            if (returnto) {
              // Go where we want to be.  Make sure we remove the code to avoid us trying to log in again.
              console.log('Return to', returnto)
              self.$router.go(returnto)
            } else {
              console.log('Just go home')
              self.$router.push('/')
            }
          } else {
            // Sometimes this fails on the server side.  Force login again.
            console.error('Server login failed', ret)
            self.$store.dispatch('auth/forceLogin', true)
          }
        })
        .catch(e => {
          console.error('Yahoo login failed', e)
        })
    }
  }
}
</script>
