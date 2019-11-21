import Vue from 'vue'
import { APIError } from '@/api/BaseAPI'

export default () => {
  const originalErrorHandler = Vue.config.errorHandler
  Vue.config.errorHandler = (err, vm, info, ...rest) => {
    if (err instanceof APIError && vm.$bvToast) {
      const { request, response } = err
      console.error(err, { request, response })
      vm.$bvToast.toast('Sorry, we messed something up!', {
        title: response.data.status,
        variant: 'danger',
        toaster: 'b-toaster-bottom-center',
        autoHideDelay: 5000,
        appendToast: true
      })
      return true
    }
    return originalErrorHandler(err, vm, info, ...rest)
  }
}
