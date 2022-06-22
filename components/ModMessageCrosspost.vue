<template>
  <div class="small">
    <span class="text-danger ">
      Crosspost
      <v-icon name="hashtag" class="text-muted" scale="0.5" />
      {{ message.id }}
      <nuxt-link :to="'/modtools/message/' + message.id">
        <em>{{ message.subject }}</em>
        {{ timeago(message.arrival) }} on <em>{{ groupname }}</em>
      </nuxt-link>
    </span>
    <span v-if="message.collection != 'Approved'">
      <span class="text-muted">in</span>
      <span class="text-danger">
        {{ message.collection }}
      </span>
    </span>
    <span v-else-if="message.outcome">, now {{ message.outcome }}</span><span v-else class="text-normal">, still open</span>
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
