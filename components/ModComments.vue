<template>
  <div>
    <ModComment v-for="comment in comments" :key="'modcomments-' + user.id + '-' + comment.id" :comment="comment" :user="user" :expand-comments="expandComments" />
    <div v-if="sortedComments.length > 1" class="mb-1">
      <b-btn v-if="!showAll" variant="white" @click="showAll = true">
        <v-icon name="tag" /> Show {{ sortedComments.length - 1 | pluralize(['more note', 'more notes'], { includeNumber: true }) }}
      </b-btn>
      <b-btn v-else variant="white" @click="showAll = false">
        <v-icon name="tag" /> Hide notes
      </b-btn>
    </div>
  </div>
</template>
<script>
import ModComment from './ModComment'

export default {
  components: { ModComment },
  props: {
    user: {
      type: Object,
      required: true
    },
    expandComments: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showAll: false
    }
  },
  computed: {
    sortedComments() {
      const ret = this.user ? this.user.comments : []

      if (ret) {
        ret.sort((a, b) => {
          const aone = this.oneOfMyGroups(a.groupid)
          const bone = this.oneOfMyGroups(b.groupid)

          if (aone && !bone) {
            return -1
          } else if (bone && !aone) {
            return 1
          } else {
            return 0
          }
        })
      }

      return ret || []
    },
    comments() {
      if (this.showAll) {
        return this.sortedComments
      } else if (this.sortedComments.length) {
        return [this.sortedComments[0]]
      } else {
        return []
      }
    }
  }
}
</script>
