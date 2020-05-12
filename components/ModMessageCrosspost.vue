<template>
  <div class="text-danger small">
    Crosspost <v-icon name="hashtag" class="text-muted" scale="0.5" /><nuxt-link :to="'/modtools/message/' + message.id">
      <em>{{ message.subject }}</em>
      {{ message.arrival | timeago }} on <em>{{ groupname }}</em>
    </nuxt-link>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    groupname() {
      const group = this.$store.getters['auth/groupById'](this.message.groupid)
      return group ? group.namedisplay : null
    }
  }
}
</script>
