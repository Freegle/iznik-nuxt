<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="12" md="6">
          <ModMember :member="user1" />
        </b-col>
        <b-col cols="12" md="6">
          <ModMember :member="user2" />
        </b-col>
      </b-row>
      <div class="d-flex flex-wrap justify-content-start pills mt-2">
        <b-btn v-if="whichposted === 'Both'" variant="warning" class="mr-1">
          Posted: {{ whichposted }}
        </b-btn>
        <b-btn v-else variant="white" class="mr-1">
          Posted: {{ whichposted }}
        </b-btn>
        <b-btn variant="white" class="mr-1">
          Joined a group: {{ whichjoined }}
        </b-btn>
        <b-btn v-if="activeSameDay" variant="primary" class="mr-1">
          Active same day
        </b-btn>
        <b-btn v-if="similarNameOrEmail" variant="primary" class="mr-1">
          Similar name/email
        </b-btn>
        <b-btn v-if="groupsInCommon" variant="primary" class="mr-1">
          Groups in common
        </b-btn>
        <b-btn v-if="probablySame" variant="success" class="mr-1">
          Probably the same
        </b-btn>
      </div>
    </b-card-body>
    <b-card-footer>
      <div class="mt-2">
        <b-btn variant="info" @click="ask">
          Ask member what they want
        </b-btn>
        <b-btn variant="white" @click="ignore">
          Ignore
        </b-btn>
      </div>
    </b-card-footer>
  </b-card>
</template>
<script>
import ModMember from '@/components/ModMember'

const LONG_THRESHOLD = 4

export default {
  components: { ModMember },
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  computed: {
    posted1() {
      return this.posted(this.user1)
    },
    posted2() {
      return this.posted(this.user2)
    },
    whichposted() {
      return this.count(this.posted1, this.posted2)
    },
    joined1() {
      return this.isMember(this.user1)
    },
    joined2() {
      return this.isMember(this.user2)
    },
    postedOrJoined1() {
      return this.posted1 || this.joined1
    },
    postedOrJoined2() {
      return this.posted2 || this.joined2
    },
    whichjoined() {
      return this.count(this.joined1, this.joined2)
    },
    user1() {
      const m1 = new Date(this.member.lastaccess)
      const m2 = new Date(this.member.relatedto.lastaccess)

      return m1 > m2 ? this.member : this.member.relatedto
    },
    user2() {
      const m1 = new Date(this.member.lastaccess)
      const m2 = new Date(this.member.relatedto.lastaccess)

      return m1 <= m2 ? this.member : this.member.relatedto
    },
    activeSameDay() {
      return this.$dayjs(this.user1.lastaccess).isSame(
        this.$dayjs(this.user2.lastaccess),
        'day'
      )
    },
    probablySame() {
      return (
        this.similarNameOrEmail && (this.groupsInCommon || this.activeSameDay)
      )
    },
    groupsInCommon() {
      const common = this.user1.memberof.filter(group => {
        const gid = group.id
        let found = false

        this.user2.memberof.forEach(group2 => {
          if (group2.id === gid) {
            found = true
          }
        })

        return found
      })

      return common && common.length
    },
    similarNameOrEmail() {
      let ret = false
      let e1 = this.email(this.user1)
      let e2 = this.email(this.user2)

      if (e1 && e2) {
        e1 = e1.substring(e1, e1.indexOf('@'))
        e2 = e2.substring(e2, e2.indexOf('@'))

        if (e1 && e2 && this.findLongest(e1, e2) >= LONG_THRESHOLD) {
          ret = true
        }
      }

      const n1 = this.user1.displayname
      const n2 = this.user2.displayname

      if (n1 && n2 && this.findLongest(n1, n2) >= LONG_THRESHOLD) {
        ret = true
      }

      return ret
    }
  },
  methods: {
    posted(member) {
      return member.messagehistory && member.messagehistory.length
    },
    isMember(member) {
      return member.memberof && member.memberof.length
    },
    count(l, r) {
      if (l && r) {
        return 'Both'
      } else if (l) {
        return 'First only'
      } else if (r) {
        return 'Second only'
      } else {
        return 'Neither'
      }
    },
    findLongest(s1, s2) {
      // From https://codereview.stackexchange.com/questions/210940/find-longest-common-string-subsequence
      const removeDistinct = (s1, s2) =>
        s1
          .split('')
          .filter(c => {
            ;(s2 + '').includes(c)
          })
          .join('')
      const findFirstSeq = (s1, s2) => {
        let seq = ''
        let i
        let j = 0
        for (i = 0; i < s1.length; i++) {
          const c = s1[i]
          while (j++ < s2.length) {
            if (seq.length + (s2.length - j - 2) < max) {
              return ''
            }
            if (c === s2[j - 1]) {
              seq += c
              break
            }
          }
        }
        return seq
      }
      const findSubseq = (s1, s2) => {
        if (s2.length <= max || s1.length <= max) {
          return maxSeq
        }
        while (s1.length && s1.length > max) {
          const seq = findFirstSeq(s1, s2)
          if (seq.length > max) {
            max = seq.length
            s1 = s1.slice(max)
            maxSeq = seq
          } else {
            s1 = s1.slice(1)
          }
        }
        return maxSeq
      }

      let max = 0
      let maxSeq
      if (s1 === s2) {
        return s1.length
      }
      const s1D = removeDistinct(s1, s2)
      const s2D = removeDistinct(s2, s1)
      if (s1D && s2D) {
        if (s1D === s2D) {
          return s1D.length
        }

        findSubseq(s1D, s2D)
        const ret = findSubseq(s2D, s1D)
        return ret ? ret.length : 0
      } else {
        return 0
      }
    },
    email(member) {
      // Depending on which context we're used it, we might or might not have an email returned.
      let ret = member.email

      if (!member.email && member.emails) {
        member.emails.forEach(e => {
          if (!e.ourdomain && (!ret || e.preferred)) {
            ret = e.email
          }
        })
      }

      return ret
    },
    ask() {
      this.$store.dispatch('members/askMerge', {
        user1: this.user1.id,
        user2: this.user2.id
      })
    },
    ignore() {
      this.$store.dispatch('members/ignoreMerge', {
        user1: this.user1.id,
        user2: this.user2.id
      })
    }
  }
}
</script>
<style scoped>
.pills .btn {
  border-radius: 20px;
}

.pills .btn:hover {
  color: black !important;
  background-color: white !important;
}
</style>
