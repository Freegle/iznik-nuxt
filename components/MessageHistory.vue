<template>
  <div>
    <div v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id" class="message-history">
      {{ group.arrival | timeago }} on <nuxt-link :to="'/explore/' + group.groupid">
        {{ group.namedisplay }}
      </nuxt-link>
      <nuxt-link v-if="displayMessageLink" :to="'/message/' + message.id" :class="modinfo ? '' : 'text-faded'">
        #{{ message.id }}
      </nuxt-link>
      <span v-if="modinfo">
        via {{ message.source }}
        <span v-if="message.fromip">
          from IP {{ message.fromip }} in <span :class="message.fromcountry === 'United Kingdom' ? '' : 'text-danger'">{{ message.fromcountry }}</span>
        </span>
        <span v-else>
          IP unavailable
        </span>
      </span>
    </div>
    <div v-if="modinfo && message.groups && message.groups.length && message.groups[0].arrival !== message.date" class="small">
      First posted {{ message.date | datetime }}
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
    },
    message: {
      type: Object,
      required: true
    },
    modinfo: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.message-history {
  font-size: 0.9rem;
  font-weight: 400;
}
</style>
