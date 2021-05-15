<template>
  <div>
    <div class="grey p-2 d-flex">
      <ProfileImage v-if="message.fromuser" :image="message.fromuser.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
      <div>
        <div v-if="message.fromuser">
          <div class="d-flex justify-content-between flex-wrap order-0">
            <nuxt-link :to="'/profile/' + message.fromuser.id" class="text-muted align-middle decornone d-flex clickme" :title="'Click to view membership for ' + message.fromuser.displayname">
              <div class="">
                Posted by {{ message.fromuser.displayname }}
              </div>
            </nuxt-link>
          </div>
          <Supporter v-if="message.fromuser.supporter" class="d-inline" />
          <div v-if="message.fromuser.info.openoffers + message.fromuser.info.openwanteds > 0">
            <span v-if="message.fromuser.info.openoffers" class="text-success">
              {{ message.fromuser.info.openoffers | pluralize([ 'open OFFER', 'open OFFERs' ], { includeNumber: true }) }}
            </span>
            <span v-if="message.fromuser.info.openoffers && message.fromuser.info.openwanteds">
              &bull;
            </span>
            <span v-if="message.fromuser.info.openwanteds" class="text-success">
              {{ message.fromuser.info.openwanteds | pluralize([ 'open WANTED', 'open WANTEDs' ], { includeNumber: true }) }}
            </span>
          </div>
        </div>
        <div v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id">
          <span :title="group.arrival">{{ group.arrival | timeago }} on</span> <nuxt-link :to="'/explore/' + exploreLink(group)">
            {{ group.namedisplay }}
          </nuxt-link>
        </div>
        <span v-if="message.milesaway" class="align-middle">
          About {{ message.milesaway | pluralize('mile', { includeNumber: true }) }} away
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import ProfileImage from '@/components/ProfileImage'
import Supporter from '@/components/Supporter'

export default {
  name: 'MessageHistory',
  components: { Supporter, ProfileImage },
  props: {
    id: {
      type: Number,
      default: 0
    },
    groups: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
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
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.grey {
  background-color: $color-gray--lighter;
}
</style>
