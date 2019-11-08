/**
 * A function to create a mixin to be used where there is an
 * optional group param in the route.
 *
 * Designed to be used with the GroupSelect component.
 *
 * @param key used for the remember key and the route segment
 * @returns a Vue mixin
 */
export default function createGroupRouteMixin(key, options = {}) {
  const { routeParam = 'id' } = options
  const rememberId = key
  function routePath(id) {
    return `/${key}/` + (id === 0 ? '' : id)
  }
  return {
    computed: {
      groupid: {
        get() {
          return this.$route.params[routeParam]
            ? parseInt(this.$route.params[routeParam])
            : 0
        },
        set(val) {
          const oldVal = this.groupid
          val = val || 0
          if (val !== oldVal) {
            // We have changed the groupid away from the one in the route! Redirect...
            this.$router.push(routePath(val))
            if (val === 0) {
              this.$store.commit('group/forget', {
                id: rememberId
              })
            }
          }
        }
      }
    },
    beforeDestroy() {
      if (this._unwatchGroupRemember) this._unwatchGroupRemember()
    },
    created() {
      this._unwatchGroupRemember = this.$store.watch(
        (state, getters) => getters['group/remembered'](rememberId),
        (val, oldVal) => {
          if (oldVal === undefined && val === undefined && this.groupid !== 0) {
            // Nothing set so far... make it what our current page is
            this.$store.commit('group/remember', {
              id: rememberId,
              val: this.groupid
            })
          } else if (val !== undefined) {
            if (this.groupid === 0) {
              // We have a remember value, but we're on the general page
              // Replace the current route
              this.$router.replace(routePath(val))
            } else if (this.groupid !== val) {
              // We've set the groupid to something else now, save it
              this.$store.commit('group/remember', {
                id: rememberId,
                val: this.groupid
              })
            }
          }
        },
        {
          immediate: true
        }
      )
    }
  }
}
