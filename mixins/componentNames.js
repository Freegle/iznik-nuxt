// We insert HTML comments with the component names.  This is useful when developing, because you can go from
// inspecting the DOM to the component source more easily without faffing around with Vue devtools.
import Vue from 'vue'

Vue.mixin({
  mounted() {
    if (process.env.NODE_ENV !== 'production') {
      if (
        this.$vnode &&
        this.$vnode.componentOptions &&
        this.$vnode.componentOptions.tag
      ) {
        this.__commentLabel = document.createComment(
          this.$vnode.componentOptions.tag
        )
        this.$el.parentNode.insertBefore(this.__commentLabel, this.$el)
      }
    }
  },
  destroyed() {
    if (this.__commentLabel) {
      this.__commentLabel.remove()
    }
  }
})
