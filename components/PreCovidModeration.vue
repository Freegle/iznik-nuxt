<template>
  <div v-if="modGroups && modGroups.length">
    <NoticeMessage variant="warning" class="mb-2">
      <p>
        Some of your groups are currently moderated, but were not moderated before lockdown:
      </p>
      <p>
        <span v-for="group in modGroups" :key="'modgroup-' + group">
          {{ group }},
        </span>
      </p>
      <p>
        You can change this in
        <em>Settings->Community->Features for Moderators->All Posts Moderated</em>.
      </p>
    </NoticeMessage>
  </div>
</template>
<script>
import NoticeMessage from '@/components/NoticeMessage'
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
            ret.push(group.namedisplay ? group.namedisplay : group.nameshort)

            ids[group.id] = true
          }
        }
      }

      return ret
    }
  }
}
</script>
