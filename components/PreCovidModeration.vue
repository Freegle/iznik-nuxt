<template>
  <div v-if="modGroups && modGroups.length">
    <NoticeMessage variant="warning" class="mb-2">
      <p>
        Some of your groups are currently moderated, but were not moderated before lockdown.  Click on the name to
        set the groups to the usual setting (new members moderated):
      </p>
      <p>
        <b-btn v-for="group in modGroups" :key="'modgroup-' + group" variant="link" @click="unmoderate(group.id)">
          {{ group.name }}
        </b-btn>
      </p>
      <p>
        You can change this in
        <em>Settings->Community->Features for Moderators->All Posts Moderated</em>.
      </p>
    </NoticeMessage>
  </div>
</template>
<script>
import NoticeMessage from '~/components/NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {},
  computed: {
    modGroups() {
      const groups = this.$store.getters['auth/groups']
      const ids = []
      const ret = []

      for (const group of groups) {
        if (
          this.amActiveModOn(group.id) &&
          group.type === 'Freegle' &&
          !group.precovidmoderated &&
          group.settings &&
          group.settings.moderated
        ) {
          if (!ids[group.id]) {
            ret.push({
              id: group.id,
              name: group.namedisplay ? group.namedisplay : group.nameshort
            })

            ids[group.id] = true
          }
        }
      }

      return ret
    }
  },
  methods: {
    async unmoderate(groupid) {
      console.log('Unmoderate', groupid)
      const group = this.$store.getters['auth/groupById'](groupid)
      const settings = group.settings
      settings.moderated = false

      await this.$store.dispatch('group/update', {
        id: groupid,
        settings
      })

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups']
      })
    }
  }
}
</script>
