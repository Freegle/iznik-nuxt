export default {
  mounted() {
    if (process.browser) {
      if (this.$route.hash) {
        setTimeout(() => {
          const el = document.getElementById(this.$route.hash.substring(1))

          if (el) {
            if ('scrollBehavior' in document.documentElement.style) {
              return window.scrollTo({
                top: el.getBoundingClientRect().top,
                behavior: 'smooth'
              })
            } else {
              return window.scrollTo(0, el.getBoundingClientRect().top)
            }
          }
        }, 500)
      }
    }
  }
}
