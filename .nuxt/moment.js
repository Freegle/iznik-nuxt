import moment from 'moment'

export default (ctx, inject) => {
  ctx.$moment = moment
  inject('moment', moment)
}
