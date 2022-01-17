<template>
  <div>
    <div v-if="message.fromuser" class="grey p-2 d-flex clickme" :title="'Click to view profile for ' + message.fromuser.displayname">
      <ProfileImage
        v-if="message.fromuser && message.fromuser.profile"
        :image="message.fromuser.profile.turl"
        class="ml-1 mb-1 inline"
        is-thumbnail
        size="sm"
        @click="showProfileModal"
      />
      <div>
        <div class="d-flex justify-content-between flex-wrap order-0" @click="showProfileModal">
          <div class="text-muted align-middle decornone d-flex">
            Posted by {{ message.fromuser.displayname }}
          </div>
        </div>
        <nuxt-link v-if="message.interacted" :to="'/chats/' + message.interacted" class="font-weight-bold" title="You've chatted to this freegler before.  Click here to view Chat.">
          <v-icon name="link" /> Connected before
        </nuxt-link>
        <Supporter v-if="message.fromuser.supporter" class="d-inline" />
        <div v-if="message.fromuser && message.fromuser.info && message.fromuser.info.openoffers + message.fromuser.info.openwanteds > 0" @click="showProfileModal">
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
        <div v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id">
          <span :title="group.arrival">{{ timeago(group.arrival) }} on</span> <nuxt-link :to="'/explore/' + exploreLink(group)">
            {{ group.namedisplay }}
          </nuxt-link>
        </div>
        <span v-if="message.milesaway" class="align-middle" @click="showProfileModal">
          About {{ message.milesaway | pluralize('mile', { includeNumber: true }) }} away
        </span>
      </div>
      <ProfileModal v-if="showProfile && message && message.fromuser" :id="message.fromuser.id" ref="profile" />
    </div>
  </div>
</template>
<script>
import ProfileImage from '@/components/ProfileImage'
import Supporter from '@/components/Supporter'

const ProfileModal = () => import('~/components/ProfileModal')

export default {
  name: 'MessageHistory',
  components: { Supporter, ProfileImage, ProfileModal },

  props: {
    id: {
      type: Number,
      default: 0
    },
    messageOverride: {
      type: Object,
      required: false,
      default: null
    },
    groups: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      showProfile: false
    }
  },
  computed: {
    message() {
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
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
    showProfileModal(e) {
      this.showProfile = true

      this.waitForRef('profile', () => {
        this.$refs.profile.show()
      })
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
