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
        via {{ source }},
        <span v-if="message.fromip">
          from IP {{ message.fromip }} in <span :class="message.fromcountry === 'United Kingdom' ? '' : 'text-danger'">{{ message.fromcountry }}.</span>
        </span>
        <span v-else>
          IP unavailable.
        </span>
      </span>
      <span v-if="group.approvedby && group.approvedby.displayname">
        Approved by {{ group.approvedby.displayname }}
      </span>
    </div>
    <div v-if="modinfo && message.groups && message.groups.length && message.groups[0].arrival !== message.date" class="small">
      <span v-if="!today">
        First posted {{ message.date | datetime }}
      </span>
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
  },
  computed: {
    today() {
      return this.$dayjs(this.message.date).isSame(this.$dayjs(), 'day')
    },
    source() {
      if (
        this.message.source === 'Email' &&
        this.message.fromaddr &&
        this.message.fromaddr.indexOf('trashnothing.com') !== -1
      ) {
        return 'TrashNothing'
      } else if (this.message.source === 'Platform') {
        return 'website or app'
      } else {
        return this.message.source
      }
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
