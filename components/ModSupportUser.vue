<template>
  <b-card v-if="user" no-body>
    <b-card-header>
      <div class="d-flex justify-content-between flex-wrap">
        <div>
          <v-icon name="envelope" /> {{ user.email }}
        </div>
        <div>
          <v-icon name="user" /> {{ user.displayname }}
        </div>
        <div>
          <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ user.id }}
        </div>
        <div @click="expanded = !expanded">
          <b-btn variant="white" size="sm">
            <v-icon v-if="!expanded" name="caret-down" />
            <v-icon v-else name="caret-up" />
          </b-btn>
        </div>
      </div>
    </b-card-header>
    <b-card-body v-if="expanded">
      <div class="d-flex flex-wrap">
        <b-btn variant="white" disabled class="mr-2 mb-1">
          <v-icon name="ban" /> Scammer
        </b-btn>
        <b-btn variant="white" disabled class="mr-2 mb-1">
          <v-icon name="trash-alt" /> Purge
        </b-btn>
        <b-btn variant="white" disabled class="mr-2 mb-1">
          <v-icon name="user" /> Impersonate
        </b-btn>
        <b-btn variant="white" disabled class="mr-2 mb-1">
          <v-icon name="equals" /> Merge
        </b-btn>
      </div>
      <h3 class="mt-2">
        Location
      </h3>
      <b-row>
        <b-col cols="12" md="6">
          <div class="d-flex justify-content-between">
            <div>
              <v-icon name="globe-europe" /> Location on ChitChat
            </div>
            <div>
              {{ user.publiclocation.display }}
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" md="6">
          <div class="d-flex justify-content-between">
            <div>
              <v-icon name="lock" /> Best guess lat/lng
            </div>
            <div>
              {{ Math.round(user.privateposition.lat * 100) / 100 }}, {{ Math.round(user.privateposition.lng * 100) / 100 }}
              <a :href="'https://www.google.com/maps?q=' + user.privateposition.lat + ',' + user.privateposition.lng" target="_blank" rel="noopener">Show on map</a>
            </div>
          </div>
        </b-col>
      </b-row>
      <h3 class="mt-2">
        Memberships
      </h3>
      <div v-if="memberships">
        <div v-for="membership in memberships" :key="'membership-' + membership.id">
          <ModSupportMembership :membership="membership" />
        </div>
        <b-btn v-if="!showAllMemberships && membershipsUnshown" variant="white" class="mt-1" @click="showAllMemberships = true">
          Show +{{ membershipsUnshown }}
        </b-btn>
      </div>
      <p v-else>
        No memberships.
      </p>
    </b-card-body>
  </b-card>
</template>
<script>
import ModSupportMembership from './ModSupportMembership'

export default {
  components: { ModSupportMembership },
  props: {
    id: {
      type: Number,
      required: true
    },
    expand: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      expanded: true,
      showAllMemberships: false
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/get'](this.id)
    },
    freegleMemberships() {
      return this.user && this.user.memberof
        ? this.user.memberof
            .filter(m => m.type === 'Freegle')
            .sort(function(a, b) {
              return a.nameshort
                .toLowerCase()
                .localeCompare(b.nameshort.toLowerCase())
            })
        : []
    },
    memberships() {
      return this.showAllMemberships
        ? this.freegleMemberships
        : this.freegleMemberships.slice(0, 3)
    },
    membershipsUnshown() {
      const ret =
        this.freegleMemberships.length > 3
          ? this.freegleMemberships.length - 3
          : 0
      console.log('Unshown', ret)
      return ret
    }
  },
  mounted() {
    this.expanded = this.expand
  },
  methods: {}
}
</script>
