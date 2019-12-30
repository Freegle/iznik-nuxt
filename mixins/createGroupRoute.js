/**
 * A function to create a mixin to be used where there is an
 * optional group param in the route.
 *
 * It will provide you a "groupid" property on your vue instance so you MUST
 * NOT also define that yourself (e.g. in the data function).
 *
 * TODO NS MINOR The URLs we produce would look prettier if we used the nameshort
 * property of a group.  You can get a group using either an id or the nameshort value.
 *
 * For example when you first visit /communityevents page it shows you events
 * from all your groups. You can select a group from the select and you will get
 * redirected to /communityevents/:id. We will save that :id.
 *
 * When you next visit /communityevents we look up the remembered :id and redirect
 * you to that page using "replace state" routing (so it doesn't go into the back
 * history).
 *
 * Designed to be used with the GroupSelect component.
 *
 * @param key used for the remember key and the route segment
 * @param options pass in routeParam to use a different route param key, defaults to id
 * @returns a Vue mixin
 */
export default function createGroupRoute(key, options = {}) {
  const DEFAULT_VALUE = null
  const { routeParam = 'id' } = options
  const rememberId = key
  function isGroupId(val) {
    return typeof val === 'number' && val > 0
  }
  function groupIdOrNull(val) {
    return isGroupId(val) ? val : null
  }
  function routePath(id) {
    return `/${key}/${isGroupId(id) ? id : ''}`
  }
  return {
    computed: {
      rememberedValue() {
        return this.$store.getters['group/remembered'](rememberId)
      },
      groupid: {
        get() {
          return this.$route.params[routeParam]
            ? groupIdOrNull(parseInt(this.$route.params[routeParam]))
            : DEFAULT_VALUE
        },
        set(val) {
          const oldVal = this.groupid
          val = groupIdOrNull(val)
          if (val !== oldVal) {
            // We have changed the groupid away from the one in the route! Redirect...
            this.$router.push(routePath(val))
            if (val === DEFAULT_VALUE) {
              this.updateMemory(DEFAULT_VALUE)
            }
          }
        }
      }
    },
    watch: {
      rememberedValue: {
        immediate: true,
        handler(val) {
          // If we have already triggered a route we don't want to do
          // any more logic about the remembered value on this page
          // it will trigger a redirect loop otherwise
          if (this.$router.history.pending) return
          if (val === undefined && this.groupid !== DEFAULT_VALUE) {
            // Nothing set so far... make it what our current page is
            this.updateMemory(this.groupid)
          } else if (val !== undefined) {
            if (this.groupid === DEFAULT_VALUE) {
              // We have a remember value, but we're on the general page
              // Replace the current route
              this.$router.replace(routePath(val))
            } else if (this.groupid !== val) {
              // We've set the groupid to something else now, save it
              this.updateMemory(this.groupid)
            }
          }
        }
      }
    },
    methods: {
      updateMemory(val) {
        if (typeof val === 'number') {
          this.$store.commit('group/remember', {
            id: rememberId,
            val
          })
        } else {
          this.$store.commit('group/forget', {
            id: rememberId
          })
        }
      }
    }
  }
}
