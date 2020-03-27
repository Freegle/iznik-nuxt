<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <GroupSelect v-model="groupid" modonly />
      <b-btn variant="white">
        <v-icon name="plus" /> Add Group TODO
      </b-btn>
    </div>
    <div v-if="group" class="mt-2">
      <h3>Community Addresses</h3>
      <p>Here's how your members can reach you by email:</p>
      <p>
        <a :href="'mailto:' + group.modsemail">{{ group.modsemail }}</a>
      </p>
      <p>Members can post by email.  Please only use this for members who really need it.</p>
      <p>
        <a :href="'mailto:' + group.groupemail">{{ group.groupemail }}</a>
      </p>
      <p v-if="!Object.values(shortlinks).length">
        Your community has no shortlinks at the moment.
      </p>
      <div v-else class="mb-2">
        <p>Your community has the following shortlinks:</p>
        <ModSettingShortlink v-for="shortlink in shortlinks" :key="'shortlink-' + shortlink.id" :shortlink="shortlink" />
      </div>
      <p>
        You can add more shortlinks
        <!-- eslint-disable-next-line -->
        <a href="/shortlinks" target="_blank">here</a>.
      </p>
      TODO
    </div>
  </div>
</template>
<script>
import GroupSelect from './GroupSelect'
import ModSettingShortlink from './ModSettingShortlink'

export default {
  components: { ModSettingShortlink, GroupSelect },
  data: function() {
    return {
      groupid: null
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.groupid)
    },
    shortlinks() {
      return this.$store.getters['shortlinks/list']
    }
  },
  watch: {
    groupid() {
      this.fetchGroup()
    }
  },
  methods: {
    async fetchGroup() {
      await this.$store.dispatch('group/fetch', {
        id: this.groupid,
        polygon: true
      })

      this.$store.dispatch('shortlinks/fetch', {
        groupid: this.groupid
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

input {
  max-width: 300px;
}
</style>
