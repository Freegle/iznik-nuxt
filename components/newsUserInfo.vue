<template>
  <span class="text-muted small">
    <span v-if="user.publiclocation" class="pl-0">
      <fa icon="map-marker-alt" />&nbsp;{{ user.publiclocation.display }}
    </span>
    <span v-if="user.activecounts.offers + user.activecounts.wanteds > 0">
      &bull;
      <nuxt-link :to="'/profile/' + user.id" class="text-success">
        <span v-if="user.activecounts.offers" class="text-success">
          {{ user.activecounts.offers | pluralize([ 'OFFER', 'OFFERs' ], { includeNumber: true }) }}&nbsp;
        </span>
        <span v-if="user.activecounts.wanteds" class="text-success">
          {{ user.activecounts.wanteds | pluralize([ 'WANTED', 'WANTEDs' ], { includeNumber: true }) }}&nbsp;
        </span>
      </nuxt-link>
    </span>
    <span v-if="user.settings.showmod">
      &bull;
      <fa icon="leaf" /> Freegle Volunteer
    </span>
  </span>
</template>
<script>
// TODO Link to profile page from OFFERs/WANTEDs
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
