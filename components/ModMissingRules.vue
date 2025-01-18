<template>
  <div>
    <NoticeMessage v-if="invalid.length" variant="danger">
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
