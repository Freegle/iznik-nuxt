// From https://github.com/maoberlehner/lazy-load-vue-components-when-they-become-visible/
// Markus Oberlehner
// Website: https://markus.oberlehner.net
// Twitter: https://twitter.com/MaOberlehner
// PayPal.me: https://paypal.me/maoberlehner
// Patreon: https://www.patreon.com/maoberlehner

export default function lazyLoadComponent({
  componentFactory,
  loading,
  loadingData
}) {
  let resolveComponent

  return () => ({
    component: new Promise(resolve => {
      resolveComponent = resolve
    }),
    loading: {
      mounted() {
        if (!(`IntersectionObserver` in window)) {
          // Immediately load the component if
          // `IntersectionObserver` is not available.
          componentFactory().then(resolveComponent)
          return
        }

        const observer = new IntersectionObserver(entries => {
          // Use `intersectionRatio` because of Edge 15's
          // lack of support for `isIntersecting`.
          // See: https://github.com/w3c/IntersectionObserver/issues/211
          if (entries[0].intersectionRatio <= 0) return

          observer.unobserve(this.$el)
          componentFactory().then(resolveComponent)
        })
        observer.observe(this.$el)
      },
      render(createElement) {
        return createElement(loading, loadingData)
      }
    }
  })
}
