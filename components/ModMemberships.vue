<template>
  <div class="mt-2 small">
    <v-icon name="users" />
    <span v-if="memberof && memberof.length">
      <span v-for="m in memberof" :key="'membership-' + m.membershipid" class="border border-info rounded p-1 mr-1">
        {{ m.namedisplay.length > 23 ? (m.namedisplay.substring(0, 20) + '...') : m.namedisplay }}
        <span :class="'small ' + (daysago(m.added) < 31 ? 'text-danger font-weight-bold' : 'text-muted')">{{ m.added | timeago }}</span>
      </span>
    </span>
    <span v-else class="border border-info rounded p-1 mr-1">
      Not on any communities
    </span>
    <b-badge v-if="hiddenmemberofs" variant="info" class="clickme" @click="allmemberships = !allmemberships">
      +{{ hiddenmemberofs }} groups
    </b-badge>
    <span v-if="applied && applied.length">
      <span v-for="m in applied" :key="'memberapplied-' + m.id + '-' + m.userid + '-' + m.added" class="border border-info rounded p-1 mr-1">
        Applied {{ m.namedisplay.length > 23 ? (m.namedisplay.substring(0, 20) + '...') : m.namedisplay }}
        <span :class="'small ' + (daysago(m.added) < 31 ? 'text-danger font-weight-bold' : 'text-muted')">{{ m.added | timeago }}</span>
      </span>
    </span>
    <b-badge v-if="hiddenapplieds" variant="info" class="clickme" @click="allapplied= !allapplied">
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
    applied() {
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

      if (this.allapplied) {
        return ms
      } else {
        return ms.slice(0, MEMBERSHIPS_SHOW)
      }
    },
    hiddenapplieds() {
      return this.allapplied
        ? 0
        : this.user && this.user.applied.length > MEMBERSHIPS_SHOW
          ? this.user.applied.length - MEMBERSHIPS_SHOW
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
