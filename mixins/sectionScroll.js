export default {
  mounted() {
    if (process.browser) {
      if (this.$route.hash) {
        const el = document.getElementById(this.$route.hash.substring(1))

        if (el) {
          console.log('Scroll to', el.getBoundingClientRect().top)
          if ('scrollBehavior' in document.documentElement.style) {
            return window.scrollTo({
              top: el.getBoundingClientRect().top,
              behavior: 'smooth'
            })
          } else {
            return window.scrollTo(0, el.getBoundingClientRect().top)
          }
        }
      }
    }
  }
}
