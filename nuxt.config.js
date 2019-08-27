const pkg = require('./package')
const API = process.env.IZNIK_API || 'https://dev.ilovefreegle.org/api'
const FACEBOOK_APPID = '134980666550322'

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#61AE24' },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/style.css',
    '@/assets/css/user.less',
    '@/assets/css/Autocomplete.css'
  ],

  plugins: [
    // Our template formatting utils.
    '~/plugins/filters',

    // Naming components via HTML comments.
    '~/mixins/componentNames',

    // Our directives
    '~/plugins/directives',

    // Our parameters serialize differently from axios defaults
    { src: '~plugins/axios-serializer.js' },

    // { src: '~plugins/axios-log.js' },

    { src: '~/plugins/vuejs-thermometer' },
    { src: '~/plugins/qs' },
    { src: '~/plugins/twemoji' },
    { src: '~/plugins/vue2-filters' },
    { src: '~plugins/axios-token' },

    // Some plugins are client-side features
    { src: '~plugins/vuex-persistedstate', ssr: false },
    { src: '~plugins/vue-drag-drop.js', ssr: false },
    { src: '~plugins/vue-draggable-resizable.js', ssr: false },
    { src: '~plugins/vue-color', ssr: false },
    { src: '~plugins/vue-infinite-loading.js', ssr: false },
    { src: '~plugins/vue2-google-maps.js', ssr: false },
    { src: '~plugins/vue-debounce', ssr: false},
    { src: '~plugins/vue-highlight-words', ssr: false},
    { src: '~plugins/vue-awesome.js', ssr: false },
    { src: '~plugins/facebook-sdk', ssr: false },
    { src: '~plugins/google-sdk', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/moment',
    'nuxt-rfg-icon',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'cookie-universal-nuxt',
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'en',
            iso: 'en-GB'
          }
        ],
        defaultLocale: 'en',
        vueI18n: {
          fallbackLocale: 'en',
          messages: {
            en: {}
          }
        }
      }
    ],
  ],

  // We only use some of bootstrap-vue, so by listing it explicitly we can reduce our bundle size.
  bootstrapVue: {
    componentPlugins: [
      'AlertPlugin',
      'BadgePlugin',
      'ButtonPlugin',
      'ButtonGroupPlugin',
      'CardPlugin',
      'CarouselPlugin',
      'CollapsePlugin',
      'DropdownPlugin',
      'EmbedPlugin',
      'FormPlugin',
      'FormCheckboxPlugin',
      'FormFilePlugin',
      'FormGroupPlugin',
      'FormInputPlugin',
      'FormRadioPlugin',
      'FormSelectPlugin',
      'FormTextareaPlugin',
      'ImagePlugin',
      'InputGroupPlugin',
      'LayoutPlugin',
      'LinkPlugin',
      'ListGroupPlugin',
      'ModalPlugin',
      'NavPlugin',
      'NavbarPlugin',
      'PopoverPlugin',
      'ProgressPlugin',
      'TabsPlugin',
      'TooltipPlugin'
    ],
    directivePlugins: ['VBPopoverPlugin', 'VBTooltipPlugin', 'VBScrollspyPlugin']
  },

  /*
  ** Axios module configuration
  */
  axios: {},

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,

    transpile: [/^vue2-google-maps($|\/)/],

    extend(config, ctx) {
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'

      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    },

    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //     automaticNameDelimiter: '.',
    //     name: true,
    //     cacheGroups: {},
    //     minSize: 100000,
    //     maxSize: 100000
    //   }
    // },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },

    loaders: {
      less: { javascriptEnabled: true },
    },
  },

  env: {
    API: API,
    FACEBOOK_APPID: FACEBOOK_APPID,
    GOOGLE_MAPS_KEY: 'AIzaSyCdTSJKGWJUOx2pq1Y0f5in5g4kKAO5dgg',
    GOOGLE_API_KEY: 'AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4',
    GOOGLE_CLIENT_ID: JSON.stringify(
      '845879623324-vbh39pc09p7342tno6jad28i3obji2aq.apps.googleusercontent.com'
    ),
    MODTOOLS: false
  },

  vue: {
    config: {
      performance: true
    }
  },
}
