<template>
  <div class="text-danger small">
    Crosspost <v-icon name="hashtag" class="text-muted" scale="0.5" />{{ message.id }} <nuxt-link :to="'/modtools/message/' + message.id">
      <em>{{ message.subject }}</em>
      {{ timeago(message.arrival) }} on <em>{{ groupname }}</em>
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
    group() {
      return this.$store.getters['group/get'](this.message.groupid)
    },
    groupname() {
      return this.group ? this.group.namedisplay : null
    }
  },
  mounted() {
    const group = this.$store.getters['group/get'](this.message.groupid)

    if (!group) {
      this.$store.dispatch('group/fetch', {
        id: this.message.groupid
      })
    }
  }
}
</script>
