<template>
  <div>
    <NoticeMessage v-if="newRulesMissing.length" variant="danger">
      <p>
        We are collecting information about which rules groups have - see
        <ExternalLink href="https://discourse.ilovefreegle.org/t/collecting-information-about-group-rules/8070">
          here
        </ExternalLink>.
        We'll use this to help freeglers get things right more often.
      </p>
      <p>
        Based on your feedback, we've added some more rule questions.  Please respond to each question
        in Settings which is flagged with <span class="text-danger font-weight-bold">New</span>.  You can copy the rules if you have
        multiple groups and they are the same.
      </p>
      <a v-for="(inv) of newRulesMissing" :key="'fbinvalid-' + inv.id" :href="'/modtools/settings/' + inv.id">
        Click to add rules for {{ inv.namedisplay }} (missing: {{ inv.missing }})<br>
      </a>
    </NoticeMessage>
    <NoticeMessage v-else-if="invalid.length" variant="danger">
      <div v-if="summary">
        <div>
          <v-icon name="exclamation-triangle" /> {{ invalid.length }} groups are missing group rules.  Please add them.
        </div>
        <b-btn variant="white" class="mt-2" @click="expand">
          Click to view
        </b-btn>
      </div>
      <div v-else>
        <p>
          We are collecting information about which rules groups have - see
          <ExternalLink href="https://discourse.ilovefreegle.org/t/collecting-information-about-group-rules/8070">
            here
          </ExternalLink>.
          We'll use this to help freeglers get things right more often.
          Please go to the <em>Rules</em> section of the group settings and respond to each question.  You can
          copy the rules if you have multiple groups.
        </p>
        <a v-for="(inv) of invalid" :key="'fbinvalid-' + inv.id" href="#" @click.prevent="gotogroup(inv.id)">
          Click to add rules for {{ inv.namedisplay }}<br>
        </a>
      </div>
    </NoticeMessage>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import ExternalLink from './ExternalLink.vue'

export default {
  components: { ExternalLink, NoticeMessage },
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      summary: true
    }
  },
  computed: {
    invalid() {
      const ret = []

      for (const group of this.myGroups) {
        if (
          group.type === 'Freegle' &&
          group.role === 'Owner' &&
          !group.rules &&
          group.publish
        ) {
          ret.push(group)
        }
      }

      return ret
    },
    newRulesMissing() {
      const ret = []

      for (const group of this.myGroups) {
        if (
          group.type === 'Freegle' &&
          group.role === 'Owner' &&
          group.rules &&
          group.publish
        ) {
          const rules = group.rules ? JSON.parse(group.rules) : null

          // Check if the rules object is missing any values from ['A', 'B', 'C']
          const missingRules = group.rules
            ? [
                'limitgroups',
                'wastecarrier',
                'carboot',
                'chineselanterns',
                'carseats',
                'pondlife',
                'copyright',
                'porn'
              ].filter(rule => !Object.keys(rules).includes(rule))
            : null

          if (missingRules.length > 0) {
            // Take upto 3 missing rules, add an ellipsis if more, convert to a string
            // and push to the ret array
            group.missing =
              missingRules.length > 3
                ? missingRules.slice(0, 3).join(',') + '...'
                : missingRules.slice(0, 3).join(',')
            ret.push(group)
          }
        }
      }

      return ret
    }
  },
  mounted() {
    if (this.expanded) {
      this.summary = false
    }
  },
  methods: {
    expand() {
      this.summary = false
    },
    gotogroup(groupid) {
      this.$router.push('/modtools/settings/' + groupid + '?noguard=true')
    }
  }
}
</script>
