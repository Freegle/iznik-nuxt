import visibility from '@/utils/visibility'

export default ({ store }) => {
  store.watch(
    () => visibility.visible,
    visible => {
      if (visible) {
        store.dispatch('notifications/count')
        store.dispatch('notifications/list')
      }
    }
  )
}
