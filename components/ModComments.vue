<template>
  <div>
    <ModComment v-for="comment in comments" :key="'modcomments-' + user.id + '-' + comment.id" :comment="comment" :user="user" />
    <div v-if="user.comments.length > 1" class="mb-1">
      <b-btn v-if="!showAll" variant="white" @click="showAll = true">
        <v-icon name="tag" /> Show {{ user.comments.length - 1 | pluralize(['more note', 'more notes'], { includeNumber: true }) }}
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
    comments() {
      if (this.showAll) {
        return this.user.comments
      } else if (this.user.comments.length) {
        return [this.user.comments[0]]
      } else {
        return []
      }
    }
  }
}
</script>
