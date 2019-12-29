import sitemap from './utils/sitemap.js'

const pkg = require('./package')
const FACEBOOK_APPID = '134980666550322'

// TODO EH In the old code we look for and record the src parameter as a way of recording where traffic comes from.
// How shall we do that now?

require('dotenv').config()

// API is the constant the code uses.
let API = '/api'
if (process.env.NUXT_BUILD_TYPE === 'fdapp') {
  API = 'https://iznik.ilovefreegle.org/api'
}

// This is where the user site is.
const USER_SITE = 'https://www.ilovefreegle.org'

// This is where images are served from.
const IMAGE_SITE = 'https://images.ilovefreegle.org'

// IZNIK_API is where we send it to.  This avoids CORS issues (and removes preflight OPTIONS calls for GETs, which
// hurt client performance).
const IZNIK_API = process.env.IZNIK_API || 'https://fdapidbg.ilovefreegle.org'

// Long polls interact badly with per-host connection limits so send to here instead.
const CHAT_HOST = 'https://users.ilovefreegle.org:555'

// Allow disabling of eslint autofix by setting "DISABLE_ESLINT_AUTOFIX=true" in env (e.g. .env file)
// defaults to enabling autofixing
const DISABLE_ESLINT_AUTOFIX =
  process.env.DISABLE_ESLINT_AUTOFIX &&
  process.env.DISABLE_ESLINT_AUTOFIX !== 'false'
const ESLINT_AUTOFIX = !DISABLE_ESLINT_AUTOFIX

const config = {
  mode: 'universal',

  /*
  ** Headers.  Include default meta tags that will apply unless overridden by individual pages.  Every page that
  * doesn't use loginRequired should consider overriding the following to something suitable:
  *
  * description
  * og:image
  * og:title
  * og:description
  * twitter:title
  * twitter:description
  * twitter:image
  *
  * All data for the SSR must be obtained in asyncData; it will then be used to render the page, and accessible
  * via the store or returned values in head().  Note that if you try to get data in an async head() then it will
  * silently fail and revert to the site default we set up here.
  */
  head: {
    title: "Freegle - Don't throw it away, give it away!",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'author', name: 'author', content: 'Freegle' },
      {
        hid: 'description',
        name: 'description',
        content:
          "Give and get stuff for free in your local community.  Don't just recycle - reuse, freecycle and freegle!"
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content:
          "Give and get stuff for free in your local community.  Don't just recycle - reuse, freecycle and freegle!"
      },

      {
        hid: 'og:image',
        property: 'og:image',
        content: USER_SITE + '/icon.png'
      },
      {
        hid: 'og:video',
        property: 'og:video',
        content: 'https://www.youtube.com/embed/Gw_wpkbNQY8'
      },
      { hid: 'og:locale', property: 'og:locale', content: 'en_GB' },
      { hid: 'og:title', property: 'og:title', content: 'Freegle' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Freegle' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          "Give and get stuff for free in your local community.  Don't just recycle - reuse, freecycle and freegle!"
      },
      { hid: 'fb:app_id', property: 'og:site_name', content: FACEBOOK_APPID },

      { hid: 'twitter:title', name: 'twitter:title', content: 'Freegle' },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          "Give and get stuff for free in your local community.  Don't just recycle - reuse, freecycle and freegle!"
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: USER_SITE + '/icon.png'
      },
      {
        hid: 'twitter:image:alt',
        name: 'twitter:image:alt',
        content: 'The Freegle logo'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      { hid: 'twitter:site', name: 'twitter:site', content: 'thisisfreegle' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://i.ytimg.com' },
      { rel: 'preconnect', href: 'https://s.ytimg.com' },
      { rel: 'preconnect', href: 'https://www.youtube.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://storage.googleapis.com' },
      { rel: 'preconnect', href: 'https://www.facebook.com' },
      { rel: 'preconnect', href: 'https://connect.facebook.com' },
      { rel: 'preconnect', href: 'https://apis.google.com' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  /*
  ** Global CSS
  */
  css: ['@/assets/css/global.scss'],

  // TODO NS We have too many plugins.  Initially I thought the only way to pull in a standard bit of Vue code
  // was to create a plugin for it.  But that is flat wrong.  Pulling them in as plugins will increase the
  // page load size, I expect, so we should take a pass through and see if any of them should be removed.
  plugins: [
    '~/plugins/polyfills',

    // Our template formatting utils.
    '~/plugins/filters',

    // Our directives
    '~/plugins/directives',

    // Iznik $api setup
    { src: '~plugins/api.js' },

    // Our parameters serialize differently from axios defaults
    { src: '~plugins/axios-serializer.js' },
    { src: '~plugins/axios-login.js' },

    // { src: '~plugins/axios-log.js' },

    { src: '~/plugins/vuejs-thermometer' },
    { src: '~/plugins/qs' },
    { src: '~/plugins/twemoji' },
    { src: '~/plugins/vue2-filters' },
    { src: '~/plugins/axios-token' },
    { src: '~/plugins/axios-baseurl' },
    { src: '~/plugins/dayjs' },

    // Some plugins are client-side features
    { src: '~plugins/visibility.js', ssr: false },
    { src: '~plugins/error-toasts.js', ssr: false },
    { src: '~plugins/vuex-persistedstate', ssr: false },
    { src: '~plugins/vue-drag-drop.js', ssr: false },
    { src: '~plugins/vue-draggable-resizable.js', ssr: false },
    { src: '~plugins/vue-color', ssr: false },
    { src: '~plugins/vue-infinite-loading.js', ssr: false },
    { src: '~plugins/vue2-google-maps.js', ssr: false },
    { src: '~plugins/vue-debounce', ssr: false },
    { src: '~plugins/vue-highlight-words', ssr: false },
    { src: '~plugins/vue-awesome.js', ssr: false },
    { src: '~plugins/vue-read-more', ssr: false },
    { src: '~plugins/facebook-sdk', ssr: false },
    { src: '~plugins/google-sdk', ssr: false },
    { src: '~plugins/vue-js-toggle-button', ssr: false },
    { src: '~plugins/vue2-datepicker', ssr: false },
    { src: '~plugins/vue-social-sharing', ssr: false },
    { src: '~plugins/vue-lazy-youtube-video', ssr: false },
    { src: '~plugins/app-init-push.js', mode: 'client' },
    { src: '~plugins/app-facebook.js', mode: 'client' }
  ],

  redirect: [
    { from: '^/chat/(.*)$', to: '/chats/$1' },
    { from: '^/mygroups$', to: '/communities' },
    { from: '^/why$', to: '/help' },
    { from: '^/contact$', to: '/help' },
    { from: '^/posters$', to: '/noticeboards' },
    { from: '^/groups', to: '/explore' },
    { from: '^/events', to: '/communityevents' },
    { from: '^/contact', to: '/help' },
    { from: '^/handbook', to: '/help' }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/sentry',
    'bootstrap-vue/nuxt',
    'nuxt-rfg-icon',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-dayjs-module',
    '@nuxtjs/redirect-module',
    [
      '@nuxtjs/component-cache',
      {
        max: 1000,
        maxAge: 300 * 60 * 60
      }
    ]
    // Removing this as it causes a scalability issue with vue-meta - see https://github.com/nuxt/vue-meta/issues/443
    // 'cookie-universal-nuxt',
    // [
    //   'nuxt-i18n',
    //   {
    //     locales: [
    //       {
    //         code: 'en',
    //         iso: 'en-GB'
    //       }
    //     ],
    //     defaultLocale: 'en',
    //     vueI18n: {
    //       fallbackLocale: 'en',
    //       messages: {
    //         en: {}
    //       }
    //     }
    //   }
    // ],
  ],

  // We only use some of bootstrap-vue, so by listing it explicitly we can reduce our bundle size.
  bootstrapVue: {
    componentPlugins: [
      'AlertPlugin',
      'BadgePlugin',
      'ButtonPlugin',
      'ButtonGroupPlugin',
      'CardPlugin',
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
      'MediaPlugin',
      'ModalPlugin',
      'NavPlugin',
      'NavbarPlugin',
      'PopoverPlugin',
      'ProgressPlugin',
      'TabsPlugin',
      'BVToastPlugin'
    ],
    directivePlugins: [
      'VBPopoverPlugin',
      'VBTooltipPlugin',
      'VBScrollspyPlugin'
    ]
  },

  /*
  ** Axios module configuration
  */
  axios: {
    proxy: true
  },

  proxy: {
    '/api/': IZNIK_API,
    '/adview.php': USER_SITE + '/adview.php'
  },

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,

    transpile: [/^vue2-google-maps($|\/)/],

    extend(config, ctx) {
      if (process.env.NODE_ENV !== 'production') {
        // TODO NS Did you add this or did I pick it up from somewhere?  Do you know why we do this?  Comment please.
        config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
      } else {
        // If we put them as files then we don't increase the bundle size.
        config.devtool = 'source-map'
      }

      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: ESLINT_AUTOFIX
          }
        })
      }

      config.resolve.alias['color-vars'] = 'assets/css/_color-vars.scss'
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        automaticNameDelimiter: '.',
        name: true,
        minSize: 100000, // Change this to 0 if you're debugging problems and can't see which npm package is at fault.
        maxSize: 100000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1]

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    },

    babel: {
      presets({ isServer }) {
        const targets = isServer
          ? { node: '10' }
          : {
              browsers: ['> 1%', 'last 2 versions', 'ie >= 8', 'safari >= 9']
            }
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              targets,
              corejs: 3
              // debug: process.env.NODE_ENV === 'production'
            }
          ]
        ]
      }
    },

    loaders: {
      less: { javascriptEnabled: true }
    },
  },

  sentry: {
    dsn: 'https://4de62393d60a4d2aae4ccc3519e94878@sentry.io/1868170',
    publishRelease: true,
  },

  env: {
    API: API,
    IZNIK_API: IZNIK_API,
    CHAT_HOST: CHAT_HOST,
    FACEBOOK_APPID: FACEBOOK_APPID,
    GOOGLE_MAPS_KEY: 'AIzaSyCdTSJKGWJUOx2pq1Y0f5in5g4kKAO5dgg',
    GOOGLE_API_KEY: 'AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4',
    GOOGLE_CLIENT_ID:
      '423761283916-1rpa8120tpudgv4nf44cpmlf8slqbf4f.apps.googleusercontent.com',
    MODTOOLS: false,
    USER_SITE: USER_SITE,
    IMAGE_SITE: IMAGE_SITE,
    IS_APP: false,
    APP_BUILD_DATE: new Date().toDateString()
  },

  vue: {
    config: {
      performance: true
    }
  },

  router: {
    middleware: ['keylogin']
  },

  sitemap: {
    routes() {
      return sitemap.includeRoutes()
    },
    exclude: sitemap.excludeRoutes,
    path: '/sitemap.xml',
    gzip: true
  }
}

if (process.env.NUXT_BUILD_TYPE === 'fdapp') {
  console.log('NUXT_BUILD_TYPE', process.env.NUXT_BUILD_TYPE)

  config.mode = 'spa'

  config.router = { // https://nuxtjs.org/api/configuration-router/ 
    mode: 'hash'    // https://router.vuejs.org/api/#mode
  }

  config.env.IS_APP = true

  config.build.publicPath = '/js/'

  config.build.optimization.minimize = false

  config.plugins.push({ src: '~plugins/app-facebook.js', mode: 'client' })

  // Remove service worker
  // https://stackoverflow.com/questions/57822378/disable-service-workers-or-workbox-in-nuxtjs-app
  config.modules = config.modules.filter(module => module !== '@nuxtjs/pwa')

  // Remove sitemap
  config.modules = config.modules.filter(module => module !== '@nuxtjs/sitemap')

  // Remove sentry
  config.modules = config.modules.filter(module => module !== '@nuxtjs/sentry')
}

module.exports = config
