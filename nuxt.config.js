import Vue from 'vue'
import Sentry from '@nuxtjs/sentry'
import { Dedupe as DedupeIntegration } from '@sentry/integrations'
import sitemap from './utils/sitemap.js'

const FACEBOOK_APPID = '134980666550322'
const SENTRY_DSN = 'https://4de62393d60a4d2aae4ccc3519e94878@sentry.io/1868170'
const YAHOO_CLIENTID =
  'dj0yJmk9N245WTRqaDd2dnA4JmQ9WVdrOWIzTlZNMU01TjJjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWRh'
const MOBILE_VERSION = '2.0.84'
const MODTOOLS_VERSION = '0.3.58'

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
let API = '/api'
if ((process.env.NUXT_BUILD_TYPE === 'fdapp') || (process.env.NUXT_BUILD_TYPE === 'mtapp')) {
  //API = 'https://fdapidbg.ilovefreegle.org/api'
  API = 'https://www.ilovefreegle.org/api'
}
if (process.env.NUXT_BUILD_TYPE === 'mtapp') {
  API = 'https://modtools.org/api'
}

// IZNIK_API is where we send it to.  This avoids CORS issues (and removes preflight OPTIONS calls for GETs, which
// hurt client performance).
const IZNIK_API = process.env.IZNIK_API || 'https://fdapilive.ilovefreegle.org'

// This is where the user site is.
const USER_SITE = 'https://www.ilovefreegle.org'

// This is where images are served from.
const IMAGE_SITE = 'https://images.ilovefreegle.org'

// Long polls interact badly with per-host connection limits so send to here instead.
const CHAT_HOST = 'https://users.ilovefreegle.org:555'

// OpenStreetMap Tile Server
const OSM_TILE =
  process.env.OSM_TILE || 'https://tiles.ilovefreegle.org/tile/{z}/{x}/{y}.png'

// Geocode server
const GEOCODE = process.env.GEOCODE || 'https://geocode.ilovefreegle.org/api'

// Allow disabling of eslint autofix by setting "DISABLE_ESLINT_AUTOFIX=true" in env (e.g. .env file)
// defaults to enabling autofixing
const DISABLE_ESLINT_AUTOFIX =
  process.env.DISABLE_ESLINT_AUTOFIX &&
  process.env.DISABLE_ESLINT_AUTOFIX !== 'false'
const ESLINT_AUTOFIX = !DISABLE_ESLINT_AUTOFIX

const config = {
  target: 'static',

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
      { name: 'color-scheme', content: 'light' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
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
      { hid: 'og:locale', property: 'og:locale', content: 'en_GB' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: "Freegle - Don't throw it away, give it away!"
      },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Freegle' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.ilovefreegle.org'
      },
      { hid: 'fb:app_id', property: 'fb:app_id', content: FACEBOOK_APPID },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          "Give and get stuff for free in your local community.  Don't just recycle - reuse, freecycle and freegle!"
      },
      { hid: 'fb:app_id', property: 'og:site_name', content: FACEBOOK_APPID },

      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: "Freegle - Don't throw it away, give it away!"
      },
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
      // Don't put icon in here, as we defined it in the layout.
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

  plugins: [
    '~/plugins/polyfills',

    // Our template formatting utils.
    '~/plugins/filters',

    // Our directives
    '~/plugins/directives',

    // Iznik $api setup
    { src: '~/plugins/api.js' },

    // Global mixins.
    { src: '~/mixins/global.js' },
    { src: '~/mixins/me.js' },

    // Our parameters serialize differently from axios defaults
    { src: '~/plugins/axios-serializer.js' },
    { src: '~/plugins/axios-login.js' },

    // { src: '~/plugins/axios-log.js' },

    { src: '~/plugins/vuejs-thermometer' },
    { src: '~/plugins/qs' },
    { src: '~/plugins/twemoji' },
    { src: '~/plugins/vue2-filters' },
    { src: '~/plugins/axios-token' },
    { src: '~/plugins/axios-baseurl' },
    { src: '~/plugins/dayjs' },
    { src: '~/plugins/vue-unique-id' },

    // Some plugins are client-side features
    { src: '~/plugins/visibility.js', ssr: false },
    { src: '~/plugins/error-toasts.js', ssr: false },
    { src: '~/plugins/vuex-persistedstate', ssr: false },
    { src: '~/plugins/vue-awesome.js', ssr: false },
    { src: '~/plugins/vue-read-more', ssr: false },
    { src: '~/plugins/vue-social-sharing', ssr: false },
    { src: '~/plugins/vue-lazy-youtube-video', ssr: false },
    { src: '~/plugins/inspectlet', ssr: false },
    { src: '~/plugins/app-init-push.js', mode: 'client' },
    { src: '~/plugins/app-facebook.js', mode: 'client' },
    { src: '~/plugins/app-google.js', mode: 'client' },
    { src: '~/plugins/app-yahoo.js', mode: 'client' },
    { src: '~/plugins/app-apple.js', mode: 'client' },
    { src: '~/plugins/vue2-leaflet', ssr: false }
  ],

  // Can't use redirect as this doesn't work with nuxt generate, so redirects are done as rewrites in nginx config.

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
    bootstrapCSS: false,
    bootstrapVueCSS: false,
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
      // eslint-disable-next-line handle-callback-err
      retryCondition: error => {
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
      },
      '@nuxtjs/html-validator'
    ]
  ],

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

    transpile: [
      /^vue2-google-maps($|\/)/,
      'vue-lazy-youtube-video',
      'vue-draggable-resizable'
    ],

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

      // Pretend we have fs - needed for OpenCV.
      config.node = {
        fs: 'empty'
      }
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

    // Possible fix for memory leak in nuxt generate as per https://github.com/nuxt/nuxt.js/issues/7855
    hooks: {
      'build:done'() {
        const modulesToClear = ['vue', 'vue/dist/vue.runtime.common.prod']
        modulesToClear.forEach(entry => {
          delete require.cache[require.resolve(entry)]
        })
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
                'safari > 9',
                'ios_saf > 9'
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
    integrations: [new DedupeIntegration()],
    publishRelease: false,
    ignoreErrors: [
      // Triggered by Microsoft crawler, see https://forum.sentry.io/t/unhandledrejection-non-error-promise-rejection-captured-with-value/14062/17
      'Non-Error exception captured',
      'Non-Error promise rejection captured',
      'can\'t redefine non-configurable property "userAgent"'
    ],
    config: {
      beforeSend(event, hint) {
        function isSafariExtension(event, hint) {
          if (
            !hint ||
            !hint.originalException ||
            !hint.originalException.stack
          ) {
            return false
          }

          if (
            hint.originalException.stack.indexOf('safari-extension:') !== -1
          ) {
            return true
          }

          return false
        }

        if (isSafariExtension(event)) {
          // Honey extension causes errors, and we're not interested in any errors inside extensions.
          console.log('Safari extension - suppress exception')
          return null
        }

        // Sentry logs unhelpful exceptions - see https://github.com/getsentry/sentry-javascript/issues/2210.
        if (hint) {
          console.log(
            'Original exception was',
            hint.originalException,
            typeof hint.originalException
          )

          if (!hint.originalException) {
            // There's basically no info to report, so there's nothing we can do.  Suppress it.
            console.log('No info - suppress exception')
            return null
            // eslint-disable-next-line
          } else if (hint.originalException.toString().match(/Down for maintenance/)) {
            console.log('Maintenance - suppress exception', this)
            return null
            // eslint-disable-next-line
          } else if (hint.originalException.toString().match(/Object Not Found Matching Id/)) {
            // This seems to be a spurious error caused by a password manager.  See
            // https://github.com/getsentry/sentry-javascript/issues/3440
            console.log(
              'Suppress Object Not Found Matching Id, probable password manager'
            )
            return null
          } else if (
            hint.originalException.name &&
            hint.originalException.name === 'TypeError'
          ) {
            console.log('TypeError')
            if (hint.originalException.message) {
              console.log('Message', hint.originalException.message)

              if (
                hint.originalException.message.match(/_leaflet_pos/) ||
                hint.originalException.message.match(/getPosition/)
              ) {
                // This exception can happen when a map is still in motion (e.g. zooming) and you navigate away from
                // the page.  So far as I can tell, this is not properly fixed by either leaflet or vue2-leaflet, but
                // causes no real problems, just Sentry clutter.  So suppress it here.
                console.log('Suppress leaflet exception')
                return null
              } else if (
                hint.originalException.message.match(
                  /can't redefine non-configurable property "userAgent"/
                )
              ) {
                // This exception happens a lot, and the best guess I can find is that it is a bugged browser
                // extension.
                console.log('Suppress userAgent')
                return null
              } else if (hint.originalException.message.match(/cancelled/)) {
                // This probably happens due to the user changing their mind and navigating away immediately.
                console.log('Suppress cancelled')
                return null
              }
            }
          } else if (
            hint.originalException.name &&
            hint.originalException.name === 'ReferenceError'
          ) {
            console.log('ReferenceError')
            if (hint.originalException.message) {
              console.log('Message', hint.originalException.message)

              if (
                hint.originalException.message.match(
                  /Can't find variable: fieldset/
                )
              ) {
                // This happens because of an old bug which is now fixed:
                // https://codereview.chromium.org/2343013005
                console.log('Old Chrome fieldset bug')
                return null
              }
            }
          }
        }

        // Add some more detail if we can.
        if (hint && hint.originalException instanceof Event) {
          event.extra.isTrusted = hint.originalException.isTrusted
          event.extra.detail = hint.originalException.detail
          event.extra.type = hint.originalException.type
        }

        return event
      }
    },
    clientIntegrations: function(integrations) {
      // Don't include breadcrumbs as this makes POSTs too large, and they fail.
      const ours = integrations
        .filter(integration => {
          return integration.name !== 'Breadcrumbs'
        })
        .push(
          new Sentry.Integrations.InboundFilters({
            // Some errors seem benign, and so we ignore them on the client side rather than clutter our sentry logs.
            ignoreErrors: [
              'ResizeObserver loop limit exceeded', // Unclear where this happens.
              'Navigation cancelled from ' // This can happen if someone clicks twice in quick succession
            ]
          })
        )

      return ours
    }
  },

  env: {
    API: API,
    IZNIK_API: IZNIK_API,
    CHAT_HOST: CHAT_HOST,
    OSM_TILE: OSM_TILE,
    GEOCODE: GEOCODE,
    FACEBOOK_APPID: FACEBOOK_APPID,
    YAHOO_CLIENTID: YAHOO_CLIENTID,
    GOOGLE_MAPS_KEY: 'AIzaSyCdTSJKGWJUOx2pq1Y0f5in5g4kKAO5dgg',
    GOOGLE_API_KEY: 'AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4',
    GOOGLE_CLIENT_ID:
      '423761283916-1rpa8120tpudgv4nf44cpmlf8slqbf4f.apps.googleusercontent.com',
    USER_SITE: USER_SITE,
    IMAGE_SITE: IMAGE_SITE,
    SENTRY_DSN: SENTRY_DSN,
    BUILD_DATE: new Date().toLocaleString('en-US')
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
    gzip: true,
    hostname: 'https://www.ilovefreegle.org'
  },

  generate: {
    // Possible fix for memory leak in nuxt generate as per https://github.com/nuxt/nuxt.js/issues/7855
    crawler: false,

    // Don't hit the server too hard.
    concurrency: 5,

    // Get the list of routes to generate - importantly the group explore pages.
    async routes(callback) {
      const all = await sitemap.includeRoutes()
      const munged = all.map(r => {
        return r.url
      })

      callback(null, munged)
    },
    exclude: [
      // We don't want to generate anything too voluminous or logged in.  But we need to generate modtools because
      // Facebook scrapes it for app purposes, and the 404 breaks the Graffiti app.
      /^\/browse/,
      /^\/story/,
      /^\/stories\/fornewsletter/,
      /^\/message/,
      /^\/chitchat/,

      // Excluded for now as slow.
      /^\/communityevent/,
      /^\/volunteering/,
      /^\/stories/,
      /^\/stats/
    ]
  },
  pwa: {
    manifest: {
      name: 'Freegle',
      description: "Don't throw it away, give it away!"
    }
  }
}

if ((process.env.NUXT_BUILD_TYPE === 'fdapp') || (process.env.NUXT_BUILD_TYPE === 'mtapp')) {
  console.log('NUXT_BUILD_TYPE', process.env.NUXT_BUILD_TYPE)

  config.ssr = false

  config.head.meta = []
  config.head.link.splice(0, 1)

  config.router = { // https://nuxtjs.org/api/configuration-router/
    mode: 'hash'    // https://router.vuejs.org/api/#mode
  }
  if (process.env.NUXT_BUILD_TYPE === 'mtapp') {
    //config.router.base = 'modtools/'
  }
  config.env.IS_APP = true
  config.env.IS_MTAPP = process.env.NUXT_BUILD_TYPE === 'mtapp'
  config.env.MOBILE_VERSION = MOBILE_VERSION
  config.env.MODTOOLS_VERSION = MODTOOLS_VERSION

  config.build.publicPath = '/js/'

  config.build.optimization.minimize = false

  // Remove service worker
  // https://stackoverflow.com/questions/57822378/disable-service-workers-or-workbox-in-nuxtjs-app
  config.modules = config.modules.filter(module => module !== '@nuxtjs/pwa')

  // Remove sitemap
  config.modules = config.modules.filter(module => module !== '@nuxtjs/sitemap')

  // Remove sentry
  config.modules = config.modules.filter(module => module !== '@nuxtjs/sentry')

  // Remove favicon generator
  config.modules = config.modules.filter(module => module !== 'nuxt-rfg-icon')

  delete config.buildModules
}

module.exports = config
