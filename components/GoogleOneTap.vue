<template>
  <div
    v-if="show"
    id="g_id_onload"
    :data-client_id="clientId"
    data-callback="handleGoogleCredentialsResponse"
    data-auto_select="true"
  />
</template>
<script>
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

export default {
  data() {
    return {
      show: false
    }
  },
  computed: {
    clientId() {
      return process.env.GOOGLE_CLIENT_ID
    }
  },
  mounted() {
    const self = this
    console.log('onetap mounted')

    // Fallback in case the script load just quietly fails.  We've seen this on some Firefox versions.
    setTimeout(() => {
      console.log('One Tap fallback')
      self.$emit('complete')
    }, 30000)

    if (!this.loggedIn) {
      try {
        console.log('Set credentials response')
        window.handleGoogleCredentialsResponse = this.handleGoogleCredentialsResponse

        console.log('Set show')
        this.show = true
        console.log('Load SDK')
        ;(function(d, s, id) {
          try {
            console.log('SDK callback')
            const fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) {
              self.$emit('complete')
              return
            }
            console.log('Load GSI')
            const js = d.createElement(s)
            js.id = id
            js.src = 'https://accounts.google.com/gsi/client'
            js.onload = e => {
              console.log('GSI loaded')
              try {
                window.google.accounts.id.prompt(notification => {
                  console.log('One Tap prompt returned', notification)

                  if (
                    notification.isNotDisplayed() ||
                    !notification.isDisplayed()
                  ) {
                    console.log('One Tap not displayed')
                    self.$emit('complete')
                  }
                })
              } catch (e) {
                console.error('One Tap error', e)
                self.$emit('complete')
              }
            }
            js.onerror = e => {
              console.log('Error loading Google One Tap', e)
              self.$emit('complete')
            }
            fjs.parentNode.insertBefore(js, fjs)
          } catch (e) {
            console.log('Exception in SDK callback', e)
          }
        })(document, 'script', 'google-jssdk')
        console.log('Loaded SDK')
      } catch (e) {
        console.log('Failed to load One Tap', e)
        self.$emit('complete')
      }
    } else {
      console.log('One Tap logged in, complete')
      self.$emit('complete')
    }
  },
  methods: {
    async handleGoogleCredentialsResponse(response) {
      console.log('Google login in OneTap', response)
      console.log('Are we logged in', this.loggedIn)

      if (!this.loggedIn) {
        const decoded = jwt_decode(response.credential)
        console.log('Decoded', decoded)

        // Now we can pass response.credential to the server, which can verify it to confirm our login as per
        // https://developers.google.com/identity/gsi/web/guides/verify-google-id-token.
      }

      this.loginType = 'Google'
      this.nativeLoginError = null
      this.socialLoginError = null
      if (response?.credential) {
        console.log('Signed in')

        try {
          await this.$store.dispatch('auth/login', {
            googlejwt: response.credential,
            googlelogin: true
          })

          // We are now logged in.
          console.log('Logged in')
        } catch (e) {
          this.socialLoginError = 'Google login failed: ' + e.message
        }
      } else if (response?.error && response.error !== 'immediate_failed') {
        this.socialLoginError = 'Google login failed: ' + response.error
      }
    }
  }
}
</script>
