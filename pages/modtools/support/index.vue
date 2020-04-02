<template>
  <div>
    <div v-if="supportOrAdmin">
      <div>
        <b-tabs content-class="mt-3" card>
          <b-tab active>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Find User
              </h2>
            </template>
            <ModSupportFindUser />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Find Group
              </h2>
            </template>
            <ModSupportFindGroup />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Find Message
              </h2>
            </template>
            <ModSupportFindMessage />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                List Groups
              </h2>
            </template>
            <ModSupportListGroups />
          </b-tab>
        </b-tabs>
      </div>
    </div>
    <NoticeMessage v-else variant="warning">
      You don't have access to Support Tools.
    </NoticeMessage>
  </div>
</template>
<script>
import ModSupportFindGroup from '../../../components/ModSupportFindGroup'
import ModSupportFindUser from '../../../components/ModSupportFindUser'
import ModSupportFindMessage from '../../../components/ModSupportFindMessage'
import ModSupportListGroups from '../../../components/ModSupportListGroups'
import loginRequired from '@/mixins/loginRequired.js'
import NoticeMessage from '@/components/NoticeMessage'

export default {
  components: {
    ModSupportListGroups,
    ModSupportFindMessage,
    ModSupportFindUser,
    ModSupportFindGroup,
    NoticeMessage
  },
  layout: 'modtools',
  mixins: [loginRequired]
}
</script>
<style scoped>
.max {
  max-width: 300px;
}
</style>
