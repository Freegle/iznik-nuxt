<template>
  <div class="bg-white rounded border border-info p-2">
    <b>{{ user.displayname }}</b>
    <br>
    <v-icon name="hashtag" class="text-muted" />{{ user.id }}
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
