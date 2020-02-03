<template>
  <nuxt-link :to="'/profile/' + user.id" class="text-success decornone" :title="'Click to view profile for ' + user.displayname">
    <span class="text-muted small d-flex justify-content-between">
      <profile-image :image="user.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
      <span class="flex-grow-1">
        Posted by {{ user.displayname }}
        <span v-if="user.milesaway">
          &bull; <b>about {{ user.milesaway | pluralize('mile', { includeNumber: true }) }} away</b>
        </span>
        <br class="d-block d-sm-none">
        <span v-if="user.info.openoffers + user.info.openwanteds > 0">
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
</template>

<script>
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
