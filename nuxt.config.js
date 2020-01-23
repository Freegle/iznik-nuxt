import Vue from 'vue'
import sitemap from './utils/sitemap.js'

const FACEBOOK_APPID = '134980666550322'
const SENTRY_DSN = 'https://4de62393d60a4d2aae4ccc3519e94878@sentry.io/1868170'
const YAHOO_CLIENTID =
  'dj0yJmk9N245WTRqaDd2dnA4JmQ9WVdrOWIzTlZNMU01TjJjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWRh'

require('dotenv').config()

// We have two constants for the API location.  Why?
// - IZNIK_API is the actual location of the server hosting the API.  It's not used directly by the code.
// - API is the constant the code uses to make an API call - it's basically just a prefix.
//
// How do these get used?
// - In axios-baseurl:
//   - On the server we set the base URL to IZNIK_API.  We make calls to the API and don't have to worry about CORS.
//   - On the client we don't set a base URL, so it goes to the server the client was served up from.  That then proxies
//     it on to IZNIK_API via the proxy: directive below.
// - The rest of the client code just uses the API prefix.  The base URL kicks in (or doesn't) as described above.
const API = '/api'

// IZNIK_API is where we send it to.  This avoids CORS issues (and removes preflight OPTIONS calls for GETs, which
// hurt client performance).
const IZNIK_API = process.env.IZNIK_API || 'https://fdapilive.ilovefreegle.org'

// This is the CDN for this site.
const CDN = process.env.CDN || '/_nuxt'
 
// This is where the user site is.
const USER_SITE = 'https://www.ilovefreegle.org'

// This is where images are served from.
const IMAGE_SITE = 'https://images.ilovefreegle.org'

// Long polls interact badly with per-host connection limits so send to here instead.
const CHAT_HOST = 'https://users.ilovefreegle.org:555'

// Allow disabling of eslint autofix by setting "DISABLE_ESLINT_AUTOFIX=true" in env (e.g. .env file)
// defaults to enabling autofixing
const DISABLE_ESLINT_AUTOFIX =
  process.env.DISABLE_ESLINT_AUTOFIX &&
  process.env.DISABLE_ESLINT_AUTOFIX !== 'false'
const ESLINT_AUTOFIX = !DISABLE_ESLINT_AUTOFIX

module.exports = {
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
      { name: 'supported-color-schemes', content: 'light' },
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
    ],
    script: [
      {
        src:
          'https://adview.online/js/pub/tracking.js?publisher=2053&channel=web&source=feed',
        defer: true
      }
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
    { src: '~plugins/vue2-google-maps.js', ssr: false },
    { src: '~plugins/vue-awesome.js', ssr: false },
    { src: '~plugins/vue-read-more', ssr: false },
    { src: '~plugins/facebook-sdk', ssr: false },
    { src: '~plugins/google-sdk', ssr: false },
    { src: '~plugins/vue-social-sharing', ssr: false },
    { src: '~plugins/vue-lazy-youtube-video', ssr: false },
    { src: '~plugins/inspectlet', ssr: false }
  ],

  redirect: [
    { from: '^/chat/(.*)$', to: '/chats/$1' },
    { from: '^/mygroups(.*)$', to: '/communities$1' },
    { from: '^/why$', to: '/help' },
    { from: '^/contact$', to: '/help' },
    { from: '^/posters$', to: '/noticeboards' },
    { from: '^/groups', to: '/explore' },
    { from: '^/events', to: '/communityevents' },
    { from: '^/contact', to: '/help' },
    { from: '^/newsfeed', to: '/chitchat' },
    { from: '^/handbook', to: '/help' },
    { from: '^//$', to: '/' }
  ],

  polyfill: {
    // This is needed for IE11.
    features: [
      {
        require: 'mutation-observer'
      },
      {
        require: 'promise-polyfill'
      },
      {
        require: 'event-polyfill'
      },
      {
        require: 'custom-event-polyfill'
      },
      {
        require: 'array-from-polyfill'
      },
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      }
    ]
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-polyfill',
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
    proxy: true,
    retry: {
      // Retry failed requests to give a bit more resilience to flaky networks, especially on mobile.
      // This also helps with server upgrades.
      //
      // Note that this doesn't retry requests that never complete.
      retries: 10,
      retryDelay: retryCount => {
        return retryCount * 1000
      },
      retryCondition: error => {
        console.log('Axios Error', error)
        return true
      },
      shouldResetTimeout: true
    }
  },

  proxy: {
    '/api/': IZNIK_API
  },

  buildModules: [
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-10627716-2',
        beforeFirstHit() {
          // This is necessary to ensure we don't need cookie consent - see /privacy.
          Vue.$ga.set('anonymizeIp', true)
        }
      }
    ]
  ],

  hooks: {
    // We have a caching CDN in front of our site.  This is particularly useful for old script files which have
    // been deleted by a new pm2 deploy on the server, but which may be loaded by a client which is open in a
    // browser but which has not yet loaded all script files.
    //
    // Nuxt doesn't allow the publicPath (CDN url) to be overridden at run time - it's baked into the manifest at
    // build time.  This hook intercepts the VueRenderer when it has loaded the manifest and updates the publicPath
    // to the current env value.
    render: {
      resourcesLoaded(resources) {
        const path =
          process.env.CDN === undefined
            ? '/_nuxt'
            : (process.env.CDN + '/_nuxt')
        resources.clientManifest && (resources.clientManifest.publicPath = path)
      }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    // analyze: true,

    // When you deploy a new version, old chunk files which hadn't yet been loaded by a client will no longer
    // exist, and may cause errors. Nuxt has some rudimentary handling for this by reloading the whole page.
    // There are some suggestions from Sentry that this doesn't always work, and there is a suggestion that
    // this is a workaround.  Even if none of that really applies, this just changes the names of the chunks, and is
    // therefore harmless.
    // https://github.com/nuxt/nuxt.js/pull/3940
    // https://stackoverflow.com/questions/59292564/nuxt-js-npm-run-build-results-in-some-js-files-being-not-found
    filenames: {
      chunk: ({ isDev }) =>
        process.env.NODE_ENV === 'development' ? '[name].js' : '[chunkhash].js'
    },

    transpile: [/^vue2-google-maps($|\/)/, 'vue-lazy-youtube-video'],

    extend(config, ctx) {
      if (process.env.NODE_ENV !== 'production') {
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
              browsers: [
                '> 1%',
                'last 2 versions',
                'ie >= 8',
                'safari >= 9',
                'ios_saf >= 9'
              ]
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
    }
  },

  sentry: {
    dsn: SENTRY_DSN,
    publishRelease: false,
    clientIntegrations: function(integrations) {
      // Don't include breadcrumbs as this makes POSTs too large, and they fail.
      return integrations.filter(integration => {
        return integration.name !== 'Breadcrumbs'
      })
    }
  },

  env: {
    API: API,
    IZNIK_API: IZNIK_API,
    CDN: CDN,
    CHAT_HOST: CHAT_HOST,
    FACEBOOK_APPID: FACEBOOK_APPID,
    YAHOO_CLIENTID: YAHOO_CLIENTID,
    GOOGLE_MAPS_KEY: 'AIzaSyCdTSJKGWJUOx2pq1Y0f5in5g4kKAO5dgg',
    GOOGLE_API_KEY: 'AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4',
    GOOGLE_CLIENT_ID:
      '423761283916-1rpa8120tpudgv4nf44cpmlf8slqbf4f.apps.googleusercontent.com',
    MODTOOLS: false,
    USER_SITE: USER_SITE,
    IMAGE_SITE: IMAGE_SITE,
    SENTRY_DSN: SENTRY_DSN,
    BUILD_DATE: new Date().toLocaleString()
  },

  vue: {
    config: {
      performance: true
    }
  },

  router: {
    middleware: ['src']
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
