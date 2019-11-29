import api from '~/api'

export default (ctx, inject) => {
  inject('api', api(ctx))
}
