<template>
  <div>
    <div v-for="group in groups" :key="'message-' + id + '-' + group.id" class="message-history d-none d-sm-block">
      {{ group.arrival | timeago }} on <nuxt-link :to="'/explore/' + group.groupid">
        {{ group.namedisplay }}
      </nuxt-link>
      <nuxt-link v-if="displayMessageLink" :to="'/message/' + id" class="text-sm text-faded">
        #{{ id }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageHistory',
  props: {
    id: {
      type: Number,
      default: 0
    },
    groups: {
      type: Array,
      default: () => []
    },
    displayMessageLink: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.message-history {
  font-size: 1rem;
  font-weight: 400;
}
</style>
