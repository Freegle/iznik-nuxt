<template>
  <nuxt-link :to="'/profile/' + user.id" class="text-success decornone" :title="'Click to view profile for ' + user.displayname">
    <span class="text-muted small">
      <profile-image :image="user.profile.turl" :alt-text="'Profile picture for ' + user.displayname" class="profilesm ml-1 mb-1" is-thumbnail />
      Posted by {{ user.displayname }}
      <span v-if="user.info.openoffers + user.info.openwanteds > 0">
        &bull;
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
  </nuxt-link>
</template>

<script>
import ProfileImage from '~/components/profile-image'

export default {
  components: {
    ProfileImage
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
