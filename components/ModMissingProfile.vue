<template>
  <div>
    <NoticeMessage v-if="missing.length" variant="warning" class="mt-1">
      <div v-if="summary">
        <v-icon name="exclamation-triangle" /> {{ missing.length | pluralize(['group is', 'groups are'], { includeNumber: true }) }} missing taglines or profile pictures.
        <b-btn variant="white" @click="expand">
          Click to view
        </b-btn>
      </div>
      <div v-else>
        <p>Groups can have a profile picture and a tagline, which are used in emails and on the site to help give your group a local feel.</p>
        <p>Please add them from <em>Settings->Group Settings</em>.</p>
        <div v-for="(inv) of missing" :key="'fbmissing-' + inv.group.id">
          <b>{{ inv.group.namedisplay }}</b>
        </div>
      </div>
    </NoticeMessage>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  data: function() {
    return {
      summary: true
    }
  },
  computed: {
    missing() {
      const groups = this.$store.getters['auth/groups']
      const ret = []

      for (const group of groups) {
        if (
          group.type === 'Freegle' &&
          (group.role === 'Moderator' || group.role === 'Owner') &&
          group.publish &&
          (!group.tagline || !group.profile)
        ) {
          ret.push({
            group: group
          })
        }
      }

      return ret
    }
  },
  methods: {
    expand() {
      this.summary = false
    }
  }
}
</script>
