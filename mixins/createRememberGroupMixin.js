/**
 * This gives you a groupid field that is saved in the group/remember store
 *
 * @param remember key to use
 * @returns a Vue mixin
 */
export default function createRememberGroupidMixin(key) {
  return {
    computed: {
      groupid: {
        get() {
          return this.$store.getters['group/remembered'](key) || 0
        },
        set(val) {
          this.$store.commit('group/remember', {
            id: key,
            val: val
          })
        }
      }
    }
  }
}
