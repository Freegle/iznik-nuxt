<template>
  <div class="mt-2 small">
    <div v-if="memberof && memberof.length">
      <div v-for="m in memberof" :key="'membership-' + m.membershipid" class="p-1 mr-1">
        <b>{{ m.namedisplay.length > 32 ? (m.namedisplay.substring(0, 32) + '...') : m.namedisplay }}</b>
        <span :class="'small ' + (daysago(m.added) < 31 ? 'text-danger font-weight-bold' : 'text-muted')">{{ m.added | timeago }}</span>
      </div>
    </div>
    <div v-else class="p-1 mr-1">
      Not on any communities
    </div>
    <b-badge v-if="hiddenmemberofs" variant="info" class="clickme mb-1" @click="allmemberships = !allmemberships">
      +{{ hiddenmemberofs }} groups
    </b-badge>
    <div v-if="visibleApplied && visibleApplied.length">
      <div v-for="m in visibleApplied" :key="'memberapplied-' + m.id + '-' + m.userid + '-' + m.added" class="p-1 mr-1">
        <b>Applied {{ m.namedisplay.length > 32 ? (m.namedisplay.substring(0, 32) + '...') : m.namedisplay }}</b>
        <span :class="'small ' + (daysago(m.added) < 31 ? 'text-danger font-weight-bold' : 'text-muted')">{{ m.added | timeago }}</span>
      </div>
    </div>
    <b-badge v-if="hiddenapplieds" variant="info" class="clickme mb-1" @click="allapplied= !allapplied">
      +{{ hiddenapplieds }} applied
    </b-badge>
  </div>
</template>
<script>
const MEMBERSHIPS_SHOW = 3

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      allmemberships: false,
      allapplied: false
    }
  },
  computed: {
    memberof() {
      if (!this.user || !this.user.memberof) {
        return null
      }

      const ms = this.user.memberof

      ms.sort(function(a, b) {
        return new Date(b.added).getTime() - new Date(a.added).getTime()
      })

      if (this.allmemberships) {
        return ms
      } else {
        return ms.slice(0, MEMBERSHIPS_SHOW)
      }
    },
    hiddenmemberofs() {
      return this.allmemberships
        ? 0
        : this.user && this.user.memberof.length > MEMBERSHIPS_SHOW
          ? this.user.memberof.length - MEMBERSHIPS_SHOW
          : 0
    },
    filteredApplied() {
      if (!this.user || !this.user.applied) {
        return null
      }

      // Filter out anything we're already on.
      const ms = this.user.applied.filter(g => {
        let member = false
        this.user.memberof.forEach(h => {
          if (h.id === g.id) {
            member = true
          }
        })

        return !member
      })

      ms.sort(function(a, b) {
        return new Date(b.added).getTime() - new Date(a.added).getTime()
      })

      return ms
    },
    visibleApplied() {
      if (this.allapplied) {
        return this.filteredApplied
      } else {
        return this.filteredApplied.slice(0, MEMBERSHIPS_SHOW)
      }
    },
    hiddenapplieds() {
      return this.allapplied
        ? 0
        : this.filteredApplied.length > MEMBERSHIPS_SHOW
          ? this.filteredApplied.length - MEMBERSHIPS_SHOW
          : 0
    }
  },
  methods: {
    daysago(d) {
      return this.$dayjs().diff(this.$dayjs(d), 'days')
    }
  }
}
</script>
