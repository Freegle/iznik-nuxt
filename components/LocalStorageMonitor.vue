<template>
  <div v-if="localStorageErrors" class="storage w-100 text-center">
    <b-alert show variant="danger">
      <p>We can't access local storage on your browser.</p>
      <p>Please clear your cache for this site. If you have security software, please disable it for this site.</p>
      <p>We'll carry on, but things may go wrong...</p>
    </b-alert>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      localStorageErrors: false
    }
  },
  mounted() {
    this.monitorLocalStorage()
  },
  methods: {
    async monitorLocalStorage() {
      // We have trouble on some devices setting info to localStorage, due to quota or security reasons.  This can
      // break us.  Try to set something to local storage so that we can check if it makes it there;
      // if not, then do a toast.
      console.log('Monitor local storage')
      const now = Date.now()
      await this.$store.dispatch('misc/set', {
        key: 'localStorageMonitor',
        value: now
      })

      setTimeout(() => {
        // Go directly to local storage to see if it's made it.
        console.log('Now check if it made it')
        let ok = false

        try {
          console.log('Get data')
          const stored = localStorage.getItem('iznik')
          console.log('Parse stored')
          const decoded = JSON.parse(stored)
          console.log('Decoded')

          if (decoded && decoded.misc && decoded.misc.localStorageMonitor) {
            console.log('Got back', decoded.misc.localStorageMonitor)
            const age =
              now - new Date(decoded.misc.localStorageMonitor).getTime()
            console.log('Age', age)

            if (age < 60000) {
              console.log('Ok')
              ok = true
            }
          } else {
            console.log("Doesn't have what we expect", decoded)
          }
        } catch (e) {
          console.log('Failed to parse local storage')
        }

        if (!ok) {
          console.error('Errors with local storage')
          this.localStorageErrors = true

          setTimeout(() => {
            this.localStorageErrors = false
          }, 30000)
        }
      }, 30000)
    }
  }
}
</script>

<style scoped>
.storage {
  position: fixed;
  bottom: 0%;
}
</style>
