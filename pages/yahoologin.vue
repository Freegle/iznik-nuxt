<template>
  <b-row>
    <b-col class="text-center">
      <b-img-lazy src="~/static/loader.gif" />
    </b-col>
  </b-row>
</template>
<script>
export default {
  mounted() {
    // We have been redirected here after an attempt to sign in with Yahoo.  We now try again to login
    // on the server.  This time we should succeed.
    console.log('Yahoologin mounted')

    const returnto = this.$route.query.returnto
    console.log('Return to', returnto)

    let match
    const pl = /\+/g // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g
    const decode = function(s) {
      return decodeURIComponent(s.replace(pl, ' '))
    }
    const query = window.location.search.substring(1)

    // We want to post to the server to do the login there.  We pass all the URL
    // parameters we have, which include the OpenID response.
    const urlParams = {}
    while ((match = search.exec(query)))
      urlParams[decode(match[1])] = decode(match[2])

    urlParams.yahoologin = true
    urlParams.returnto = document.URL
    console.log('Got URL params', urlParams)

    this.$axios
      .post(process.env.API + '/session', urlParams)
      .then(result => {
        const ret = result.data
        console.log('Yahoologin session login returned', ret)
        if (ret.ret === 0) {
          // We are logged in.  Get the logged in user
          console.log('Logged in')
          this.$store.dispatch('auth/fetchUser')
          this.pleaseLogin = false

          if (returnto) {
            console.log('Return to', returnto)
            this.$router.push(returnto)
          } else {
            this.$router.push('/')
          }
        } else {
          // TODO
          console.error('Server login failed', ret)
        }
      })
      .catch(e => {
        // TODO
        console.error('Yahoo login failed', e)
      })
  }
}
</script>
