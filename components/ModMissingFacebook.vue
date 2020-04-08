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
          <p>
            Facebook page <a :href="'https://facebook.com/' + inv.page.id" target="_blank" rel="noopener nofollower">{{ inv.page.name }}</a>
            for community
            <b>{{ inv.group.namedisplay }}</b>
          </p>
          <b-btn class="mb-2" variant="white" :href="'https://modtools.org/facebook/facebook_request.php?type=Page&groupid=' + inv.group.id" target="_blank" rel="noopener noreferrer">
            Relink
          </b-btn>
        </div>
      </div>
    </NoticeMessage>
    <NoticeMessage v-if="notlinked.length" variant="warning" class="mt-1">
      <div v-if="summary">
        <v-icon name="exclamation-triangle" /> {{ notlinked.length | pluralize(['community needs', 'communities need'], { includeNumber: true }) }} need to be linked to a Facebook page.
        <b-btn variant="white" @click="expand">
          Click to view
        </b-btn>
      </div>
      <div v-else>
        <p>Communities can be linked to a Facebook page, to get extra publicity. Some of your groups aren't.</p>
        <p>Please click to go to the Settings page where you can link from the <em>Social Media</em> section.</p>
        <div v-for="(inv) of notlinked" :key="'fbnotlinked-' + inv.group.id">
          <nuxt-link :to="'/modtools/settings/' + inv.group.id">
            {{ inv.group.namedisplay }}
          </nuxt-link>
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
