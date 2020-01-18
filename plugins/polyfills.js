// This will mean we always use the polyfill, which isn't ideal.
// See https://stackoverflow.com/questions/52452501/how-to-add-a-polyfill-to-nuxt-2-0 for background.
import 'core-js/es/set'
import 'core-js/es/promise'

// We need various polyfills for the Facebook SDK on IE11, and it's getting tedious to work out which.  Grab 'em all.
import 'core-js/es/array'
import 'core-js/es/object'
import 'core-js/es/symbol'
