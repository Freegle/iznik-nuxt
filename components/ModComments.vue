<template>
  <div>
    <ModComment v-for="comment in user.comments" :key="'modcomments-' + user.id + '-' + comment.id" :comment="comment" :user="user" />
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
  }
}
</script>
