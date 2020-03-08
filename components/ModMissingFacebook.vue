<template>
  <div>
    <NoticeMessage v-if="invalid.length" variant="danger">
      <div v-if="summary">
        <v-icon name="exclamation-triangle" /> {{ invalid.length }} Facebook {{ invalid.length | pluralize(['page has', 'pages have']) }} become unlinked.
        <b-btn variant="white" @click="expand">
          Click to view
        </b-btn>
      </div>
      <div v-else>
        <div v-for="(inv) of invalid" :key="'fbinvalid-' + inv.page.uid">
          Facebook page <a :href="'https://facebook.com/' + inv.page.id" target="_blank" rel="noopener nofollower">{{ inv.page.name }}</a>
          for group
          <b>{{ inv.group.namedisplay }}</b>
          <b-btn variant="link" disabled class="mb-1">
            Relink
          </b-btn>
        </div>
        <!--        TODO Relink-->
      </div>
    </NoticeMessage>
    <NoticeMessage v-if="notlinked.length" variant="warning" class="mt-1">
      <div v-if="summary">
        <v-icon name="exclamation-triangle" /> {{ notlinked.length | pluralize('group', { includeNumber: true }) }} need to be linked to a Facebook page.
        <b-btn variant="white" @click="expand">
          Click to view
        </b-btn>
      </div>
      <div v-else>
        <p>Groups can be linked to a Facebook page, to get extra publicity. Some of your groups aren't.</p>
        <p>Please link from <em>Settings->Group Settings</em>.</p>
        <div v-for="(inv) of notlinked" :key="'fbnotlinked-' + inv.group.id">
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
    invalid() {
      const groups = this.$store.getters['auth/groups']
      const ret = []

      for (const group of groups) {
        if (
          group.type === 'Freegle' &&
          group.facebook &&
          (group.role === 'Moderator' || group.role === 'Owner') &&
          group.publish
        ) {
          for (const fb of group.facebook) {
            if (!fb.valid && fb.type === 'Page') {
              ret.push({
                page: fb,
                group: group
              })
            }
          }
        }
      }

      return ret
    },
    notlinked() {
      const groups = this.$store.getters['auth/groups']
      const ret = []

      for (const group of groups) {
        if (
          group.type === 'Freegle' &&
          (group.role === 'Moderator' || group.role === 'Owner') &&
          group.publish
        ) {
          if (!group.facebook) {
            ret.push({
              group: group
            })
          }
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
