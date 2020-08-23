<template>
  <nuxt-link :to="'/profile/' + user.id" class="text-success decornone" :title="'Click to view profile for ' + user.displayname">
    <span class="text-muted small">
      <span v-if="user.publiclocation" class="pl-0">
        <v-icon name="map-marker-alt" />&nbsp;{{ user.publiclocation.display }}
      </span>
      <span v-if="user.activecounts && user.activecounts.offers + user.activecounts.wanteds > 0">
        &bull;
        <span v-if="user.activecounts.offers" class="text-success">
          {{ $pluralize('OFFER', user.activecounts.offers, true) }}&nbsp;
        </span>
        <span v-if="user.activecounts.wanteds" class="text-success">
          {{ $pluralize('WANTED', user.activecounts.wanteds, true) }}&nbsp;
        </span>
      </span>
      <span v-if="user.settings.showmod">
        &bull;
        <v-icon name="leaf" /> Freegle Volunteer
      </span>
    </span>
  </nuxt-link>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
