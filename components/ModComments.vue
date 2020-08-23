<template>
  <div>
    <ModComment v-for="comment in comments" :key="'modcomments-' + user.id + '-' + comment.id" :comment="comment" :user="user" />
    <div v-if="user.comments.length > 1" class="mb-1">
      <b-btn v-if="!showAll" variant="white" @click="showAll = true">
        <v-icon name="tag" /> Show {{ $pluralize('more note', user.comments.length - 1, true) }}
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
      const myGroups = this.$store.getters['auth/groups']

      ret.sort((a, b) => {
        const aone = this.oneOfMine(a.groupid, myGroups)
        const bone = this.oneOfMine(b.groupid, myGroups)

        if (aone && !bone) {
          return -1
        } else if (bone && !aone) {
          return 1
        } else {
          return 0
        }
      })

      return ret
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
  },
  methods: {
    oneOfMine(groupid, myGroups) {
      return myGroups.find(g => {
        return g.id === groupid
      })
    }
  }
}
</script>
