export default function docsModule() {
  if (!this.nuxt.options.dev) return
  this.extendRoutes((routes, resolve) => {
    routes.push({
      name: 'docs',
      path: '/docs',
      component: resolve(__dirname, 'docpages/index')
    })
  })
}
