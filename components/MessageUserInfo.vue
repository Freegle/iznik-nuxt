<template>
  <nuxt-link :to="'/profile/' + user.id" class="text-success decornone" :title="'Click to view profile for ' + user.displayname">
    <span class="text-muted small">
      <b-img-lazy
        rounded="circle"
        thumbnail
        class="profilesm p-0 ml-1 mb-1"
        :alt="'Profile picture for ' + user.displayname"
        :src="user.profile.turl"
        @error.native="brokenImage"
      />
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
// TODO Link to profile page from OFFERs/WANTEDs
export default {
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
