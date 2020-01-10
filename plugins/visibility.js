import visibility from '@/utils/visibility'

export default ({ store }) => {
  store.watch(
    () => visibility.visible,
    visible => {
      const me = store.getters['auth/user']

      if (me && visible) {
        // We have become visible.  Refetch our notification count and chat count, which are the two key things which
        // produce red badges people should click on.
        store.dispatch('notifications/count')
        store.dispatch('chats/listChats')
      }
    }
  )
}
