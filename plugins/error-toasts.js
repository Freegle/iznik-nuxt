import Vue from 'vue'
import { APIError } from '@/api/BaseAPI'

const TOAST_EMAIL = 'support@ilovefreegle.org'
const TOAST_TITLE = 'Sorry, something went wrong'
const TOAST_MESSAGE = `
  That might be a bug.
  Please try again - if you continue to have problems then
  please take a screenshot and contact ${TOAST_EMAIL}
`

// TODO DESIGN Make this prettier.

export default () => {
  const originalErrorHandler = Vue.config.errorHandler
  Vue.config.errorHandler = (err, vm, info, ...rest) => {
    if (err instanceof APIError && vm.$bvToast) {
      const { request, response } = err
      console.error(err, { request, response })
      vm.$bvToast.toast(TOAST_MESSAGE, {
        title: TOAST_TITLE,
        variant: 'danger',
        toaster: 'b-toaster-bottom-center',
        autoHideDelay: 10000,
        appendToast: true,
        solid: true
      })
      return true
    }

    console.log('-------------errorHandler', err, vm, info) // CC

    if (originalErrorHandler) {
      return originalErrorHandler(err, vm, info, ...rest)
    }
  }
}
