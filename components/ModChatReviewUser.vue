<template>
  <div class="bg-white rounded border border-info p-2">
    <!--    TODO Click to go to membership-->
    {{ tag }}<b>{{ user.displayname }}</b>
    <span class="small">
      <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ user.id }}
    </span>
    <div v-if="user.comments">
      <ModUserComment v-for="comment in user.comments" :key="'comment-' + comment.id" :comment="comment" />
    </div>
  </div>
</template>
<script>
import ModUserComment from './ModUserComment'
export default {
  components: { ModUserComment },
  props: {
    user: {
      type: Object,
      required: true
    },
    tag: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
