import visibility from '@/utils/visibility'

export default ({ store }) => {
  store.watch(() => visibility.visible, async function(visible) {
    const me = store.getters['auth/user']
    const modtools = store.getters['misc/get']('modtools')

    store.dispatch('misc/set', {
      key: 'visible',
      value: visible
    })

    if (me && visible) {
      // We have become visible.  Refetch our notification count and chat count, which are the two key things which
      // produce red badges people should click on.
      store.dispatch('notifications/updateUnreadNotificationCount')

      const currentCount = store.getters['chats/unseenCount']
      const newCount = await store.dispatch('chats/unseenCount')

      if (newCount !== currentCount) {
        // It's changed - get the up to date chat rooms.
        await store.dispatch('chats/listChats', {
          chattypes: modtools
            ? ['User2Mod', 'Mod2Mod']
            : ['User2User', 'User2Mod'],
          summary: true,
          noerror: true
        })
      }
    }
  })
}
