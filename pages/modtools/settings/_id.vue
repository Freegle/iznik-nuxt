<template>
  <div class="bg-white">
    <b-tabs v-model="tabIndex" content-class="mt-3" card>
      <b-tab>
        <template v-slot:title>
          <h2 class="ml-2 mr-2">
            Personal
          </h2>
        </template>
        <ModSettingsPersonal />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <h2 class="ml-2 mr-2">
            Community
          </h2>
        </template>
        <ModSettingsGroup :initial-group="loadGroup" />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <h2 class="ml-2 mr-2">
            Standard Messages
          </h2>
        </template>
        <ModSettingsModConfig />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <h2 class="ml-2 mr-2 text-muted">
            Bulk Operations
          </h2>
        </template>
        <p>
          All the old bulk operations were to do with Yahoo.  We will need to do some new ones for native groups.
          TODO
        </p>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import ModSettingsPersonal from '@/components/ModSettingsPersonal'
import ModSettingsGroup from '@/components/ModSettingsGroup'
import ModSettingsModConfig from '@/components/ModSettingsModConfig'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  layout: 'modtools',
  components: {
    ModSettingsModConfig,
    ModSettingsGroup,
    ModSettingsPersonal
  },
  mixins: [loginRequired],
  data: function() {
    return {
      tabIndex: null,
      loadGroup: null
    }
  },
  created() {
    this.loadGroup = parseInt(this.$route.params.id) || null
  },
  mounted() {
    console.log('Mounted', this.loadGroup)
    if (this.loadGroup) {
      // We've been asked to load group setting.
      this.$nextTick(() => {
        this.tabIndex = 1
      })
    }
  }
}
</script>
