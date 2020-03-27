<template>
  <div class="bg-white">
    <b-tabs content-class="mt-3" card>
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
        <ModSettingsGroup />
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <h2 class="ml-2 mr-2">
            ModConfig
          </h2>
        </template>
        <ModSettingsModConfig />
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import ModSettingsPersonal from '../../components/ModSettingsPersonal'
import ModSettingsGroup from '../../components/ModSettingsGroup'
import ModSettingsModConfig from '../../components/ModSettingsModConfig'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  layout: 'modtools',
  components: { ModSettingsModConfig, ModSettingsGroup, ModSettingsPersonal },
  mixins: [loginRequired]
}
</script>
