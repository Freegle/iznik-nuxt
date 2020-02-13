<template>
  <span class="w-100 d-flex justify-content-between">
    <nuxt-link :to="'/profile/' + user.id" class="text-success decornone" :title="'Click to view profile for ' + user.displayname">
      <span class="text-muted small d-flex justify-content-between">
        <profile-image :image="user.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
        <span class="flex-grow-1">
          <span class="align-middle">
            Posted by {{ user.displayname }}
          </span>
          <span v-if="milesaway">
            &bull; <b>about {{ milesaway | pluralize('mile', { includeNumber: true }) }} away</b>
          </span>
          <br class="d-block d-sm-none">
          <span v-if="!modinfo && (user.info.openoffers + user.info.openwanteds > 0)">
            <span class="d-none d-sm-inline">&bull;</span>
            <span v-if="user.info.openoffers" class="text-success">
              {{ user.info.openoffers | pluralize([ 'open OFFER', 'open OFFERs' ], { includeNumber: true }) }}
            </span>
            <span v-if="user.info.openoffers && user.info.openwanteds">
              &bull;
            </span>
            <span v-if="user.info.openwanteds" class="text-success">
              {{ user.info.openwanteds | pluralize([ 'open WANTED', 'open WANTEDs' ], { includeNumber: true }) }}
            </span>
          </span>
        </span>
      </span>
    </nuxt-link>
    <div v-if="modinfo && membership" class="d-flex flex-grow-1 justify-content-between">
      <span class="ml-2">
        <v-icon name="calendar-alt" />
        <span :class="joinedAge <= 31 ? 'text-danger' : ''">Joined {{ membership.added | dateshort }}</span>
      </span>
      <ModModeration :membership="membership" class="ml-2" />
    </div>
  </span>
</template>

<script>
import ProfileImage from '~/components/ProfileImage'
const ModModeration = () => import('./ModModeration')

export default {
  components: {
    ModModeration,
    ProfileImage
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    milesaway: {
      type: Number,
      required: false,
      default: null
    },
    modinfo: {
      type: Boolean,
      default: false
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    membership() {
      let ret = null

      if (this.groupid) {
        ret = this.user.memberof.find(g => g.id === this.groupid)
      }

      return ret
    },
    joinedAge() {
      if (this.membership) {
        return new this.$dayjs().diff(
          new this.$dayjs(this.membership.added),
          'days'
        )
      }

      return null
    }
  }
}
</script>
