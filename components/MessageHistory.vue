<template>
  <div>
    <div v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id" class="text--small">
      <span class="time" :title="group.arrival">{{ arrival(group.arrival) }} on</span> <nuxt-link :to="'/explore/' + exploreLink(group)">
        {{ group.namedisplay }}
      </nuxt-link>
      <client-only>
        <nuxt-link v-if="displayMessageLink" :to="'/message/' + message.id" :class="modinfo ? '' : 'text-faded'">
          #{{ message.id }}
        </nuxt-link>
      </client-only>
      <span v-if="modinfo">
        via {{ source }},
        <span v-if="message.fromip">
          from IP {{ message.fromip }} in <span :class="message.fromcountry === 'United Kingdom' ? '' : 'text-danger'">{{ message.fromcountry }}.</span>
        </span>
        <span v-else>
          IP unavailable.
        </span>
      </span>
      <span v-if="group && group.approvedby && group.approvedby.displayname" class="text-faded">
        Approved by {{ group.approvedby.displayname }}
      </span>
    </div>
    <div v-if="modinfo && message.groups && message.groups.length && message.groups[0].arrival !== message.date" class="small">
      <span v-if="!today">
        First posted {{ datetime(message.date) }}
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
      } else if (this.message.sourceheader === 'Freegle App') {
        return 'Freegle Mobile App'
      } else if (this.message.source === 'Platform') {
        return 'Freegle website'
      } else {
        return this.message.source
      }
    }
  },
  methods: {
    exploreLink(group) {
      // Better to link to the group by name if possible to avoid nuxt generate creating explore pages for the
      // id variants.
      const thegroup = this.$store.getters['group/get'](group.groupid)

      if (thegroup) {
        return thegroup.nameshort
      } else {
        return group.groupid
      }
    },
    arrival(time) {
      // If we're logged out, just show the time.  This avoids screen flicker where we show an older date from a
      // version of a page which we've rendered earlier and then update on the client.
      if (this.me) {
        return this.$dayjs(time).fromNow()
      } else {
        return this.$dayjs(time).format('Do MMMM, YYYY HH:mm')
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.time {
  color: $colour-success-fg;
}
</style>
