<template>
  <b-card v-if="user" no-body>
    <b-card-header class="clickme" @click="expanded = !expanded">
      <b-row>
        <b-col cols="12" sm="3">
          <v-icon name="envelope" /> {{ user.email }}
        </b-col>
        <b-col cols="12" sm="3">
          <v-icon name="user" /> {{ user.displayname }}
        </b-col>
        <b-col cols="6" sm="3">
          <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ user.id }}
        </b-col>
        <b-col cols="6" sm="3">
          <div class="float-right">
            <b-btn variant="white" size="sm">
              <v-icon v-if="!expanded" name="caret-down" />
              <v-icon v-else name="caret-up" />
            </b-btn>
          </div>
        </b-col>
      </b-row>
    </b-card-header>
    <b-card-body v-if="expanded">
      <div class="d-flex flex-wrap">
        <b-btn variant="white" disabled class="mr-2 mb-1">
          <v-icon name="ban" /> Scammer
        </b-btn>
        <b-btn variant="white" class="mr-2 mb-1" @click="purge">
          <v-icon name="trash-alt" /> Purge
        </b-btn>
        <b-btn variant="white" disabled class="mr-2 mb-1">
          <v-icon name="user" /> Impersonate
        </b-btn>
        <b-btn variant="white" disabled class="mr-2 mb-1">
          <v-icon name="equals" /> Merge
        </b-btn>
        <b-btn variant="white" class="mr-2 mb-1" @click="logs">
          <v-icon name="book-open" /> Logs
        </b-btn>
        <b-btn variant="white" class="mr-2 mb-1" @click="profile">
          <v-icon name="user" /> Profile
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
      <h3 class="mt-2">
        Other Known Emails
      </h3>
      <div v-for="otheremail in otherEmails" :key="'otheremail-' + otheremail.id">
        {{ otheremail.email }}
        <span class="text-muted" :title="otheremail.toLocaleString()">
          added {{ otheremail.added | timeago }}
        </span>
      </div>
      <h3 class="mt-2">
        Membership History
      </h3>
      <h4>Recent Applications</h4>
      <div v-if="user.applied && user.applied.length">
        <div v-for="applied in user.applied" :key="'applied-' + applied.added">
          {{ applied.nameshort }}
          <span class="text-muted" :title="applied.added.toLocaleString()">
            {{ applied.added | timeago }}
          </span>
        </div>
      </div>
      <div v-else>
        No recent applications.
      </div>
      <h4 class="mt-2">
        Full History
      </h4>
      <div v-if="membershipHistoriesShown.length">
        <div v-for="membershiphistory in membershipHistoriesShown" :key="'membershiphistory-' + membershiphistory.timestamp">
          {{ membershiphistory.group.nameshort }}
          <span class="text-muted" :title="membershiphistory.timestamp.toLocaleString()">
            {{ membershiphistory.timestamp | timeago }}
          </span>
        </div>
        <b-btn v-if="!showAllMembershipHistories && membershipHistoriesUnshown" variant="white" class="mt-1" @click="showAllMembershipHistories = true">
          Show +{{ membershipsUnshown }}
        </b-btn>
      </div>
      <div v-else>
        No application history.
      </div>
    </b-card-body>
    <ModLogsModal ref="logs" :userid="user.id" />
    <ConfirmModal v-if="purgeConfirm" ref="purgeConfirm" :title="'Purge ' + user.displayname + ' from the system?'" message="<p><b>This can't be undone.</b></p><p>Are you completely sure you want to do this?</p>" @confirm="purgeConfirmed" />
    <ProfileModal v-if="user && user.info" :id="id" ref="profile" />
  </b-card>
</template>
<script>
import waitForRef from '../mixins/waitForRef'
import ModSupportMembership from './ModSupportMembership'
import ModLogsModal from './ModLogsModal'
import ConfirmModal from './ConfirmModal'
import ProfileModal from './ProfileModal'

const SHOW = 3

export default {
  components: {
    ProfileModal,
    ConfirmModal,
    ModLogsModal,
    ModSupportMembership
  },
  mixins: [waitForRef],
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
      purgeConfirm: false,
      showAllMemberships: false,
      showAllMembershipHistories: false
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
        : this.freegleMemberships.slice(0, SHOW)
    },
    membershipsUnshown() {
      const ret =
        this.freegleMemberships.length > SHOW
          ? this.freegleMemberships.length - SHOW
          : 0
      return ret
    },
    otherEmails() {
      return this.user.emails.filter(e => {
        return e.email !== this.user.email && !e.ourdomain
      })
    },
    membershiphistories() {
      const times = []
      const ret = []

      if (this.user && this.user.membershiphistory) {
        this.user.membershiphistory.forEach(h => {
          if (times.indexOf(h.timestamp) === -1) {
            times.push(h.timestamp)
            ret.push(h)
          }
        })
      }

      return ret
    },
    membershipHistoriesShown() {
      return this.showAllMembershipHistories
        ? this.membershiphistories
        : this.membershiphistories.slice(0, SHOW)
    },
    membershipHistoriesUnshown() {
      const ret =
        this.membershiphistories.length > SHOW
          ? this.membershiphistories.length - SHOW
          : 0
      return ret
    }
  },
  mounted() {
    this.expanded = this.expand
  },
  methods: {
    logs() {
      this.$refs.logs.show()
    },
    async profile() {
      await this.$store.dispatch('user/fetch', {
        id: this.id,
        info: true
      })

      this.$refs.profile.show()
    },
    purgeConfirmed() {
      this.$store.dispatch('members/purge', {
        userid: this.id
      })
    },
    purge() {
      this.purgeConfirm = true

      this.waitForRef('purgeConfirm', () => {
        this.$refs.purgeConfirm.show()
      })
    }
  }
}
</script>
