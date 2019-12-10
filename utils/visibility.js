/**
 * Determine whether the page/tab/app is visible for the user (or hidden away in a tab, in background, etc).
 *
 * It exposes a reactive object with one boolean property "visible", you can use this in components, computed methods,
 * store watchers, or whatever really.
 *
 * In Vue v3 there will be a watch API [1] that you can use outside of components, or stores, but for now we can (ab)use
 * the store watch API, e.g.
 *
 *    store.watch(
 *      () => visibility.visible,
 *      visible => {
 *        if (visible) {
 *          console.log('I just became visible!')
 *        }
 *      }
 *    )
 *
 * Implementation is a mixture of:
 * - https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 * - https://github.com/quasarframework/quasar/blob/dev/ui/src/plugins/AppVisibility.js
 * - https://github.com/yunity/karrot-frontend/blob/master/src/utils/datastore/presenceReporter.js
 *
 * [1] https://github.com/vuejs/rfcs/blob/function-apis/active-rfcs/0000-function-api.md#watchers
 */
import Vue from 'vue'

const state = Vue.observable({ visible: true })

setupVisiblityListener(visible => {
  state.visible = visible
})

setupTimer(visible => {
  state.visible = visible
})

export default state

function setupVisiblityListener(onUpdate) {
  let prop, evt

  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    prop = 'hidden'
    evt = 'visibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    prop = 'msHidden'
    evt = 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    prop = 'webkitHidden'
    evt = 'webkitvisibilitychange'
  }

  const update = () => {
    onUpdate(!document[prop])
  }

  update()

  if (evt && typeof document[prop] !== 'undefined') {
    document.addEventListener(evt, update, false)
  }
}

function setupTimer(onUpdate) {
  let timer
  const resetTimer = e => {
    clearTimeout(timer)
    onUpdate(true)
    timer = setTimeout(() => onUpdate(false), 30 * 1000) // 30 seconds
  }
  ;[
    'load',
    'mousemove',
    'keydown',
    'DOMMouseScroll',
    'mousewheel',
    'mousedown',
    'touchstart',
    'touchmove',
    'click'
  ].forEach(event => document.addEventListener(event, resetTimer))
}
