import Vue from 'vue'
import { APIError, MaintenanceError } from '@/api/BaseAPI'

const TOAST_EMAIL = 'support@ilovefreegle.org'
const TOAST_TITLE = 'Sorry, something went wrong'
const TOAST_MESSAGE = `
  That might be a bug, or perhaps your network connection broke.
  Please try again - if you continue to have problems then
  please take a screenshot and contact ${TOAST_EMAIL}
`

export default () => {
  const originalErrorHandler = Vue.config.errorHandler
  Vue.config.errorHandler = (err, vm, info, ...rest) => {
    if (err instanceof MaintenanceError) {
      // This is thrown in response to API return codes from the server.  Go to the maintenance page.
      console.log('Caught maintenance error', vm.$route.path, vm.$router)
      if (vm.$route.path !== '/maintenance') {
        vm.$router.push('/maintenance')
      } else {
        return false
      }
    } else if (err instanceof APIError && vm && vm.$bvToast) {
      const { request, response } = err
      try {
        // We have seen Sentry issues which look as though our console.error log here is itself causing an exception,
        // on older devices which might be less good at using console on complex objects.
        //
        // So log more carefully.
        console.log('Vue errorHandler')
        console.log('Err', err)
        console.log('Request', request)
        console.error('Response', response)
      } catch (e) {
        console.error('Error in toast logging', e)
      }

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

    if (originalErrorHandler) {
      return originalErrorHandler(err, vm, info, ...rest)
    }
  }
}
