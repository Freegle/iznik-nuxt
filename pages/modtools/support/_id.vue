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
            <ModSupportFindUser :id="id" />
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
            <p>
              You can search for message by id, or by subject.  This will only return the first few results, so the more
              specific, the better.
            </p>
            <ModFindMessage />
            <div v-if="messages" class="mt-2">
              <ModMessage
                v-for="message in messages"
                :key="'message-' + message.id"
                :message="message"
                noactions
              />
            </div>
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                List Groups
              </h2>
            </template>
            <ModSupportListGroups />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Contact Group
              </h2>
            </template>
            <ModSupportContactGroup />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Add Group
              </h2>
            </template>
            <ModSupportAddGroup />
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Check Volunteers
              </h2>
            </template>
            <ModSupportCheckVolunteers />
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
import loginRequired from '@/mixins/loginRequired.js'
import ModSupportFindGroup from '../../../components/ModSupportFindGroup'
import ModSupportFindUser from '../../../components/ModSupportFindUser'
import ModFindMessage from '../../../components/ModFindMessage'
import ModSupportListGroups from '../../../components/ModSupportListGroups'
import ModSupportAddGroup from '../../../components/ModSupportAddGroup'
import ModSupportContactGroup from '../../../components/ModSupportContactGroup'
import ModSupportCheckVolunteers from '../../../components/ModSupportCheckVolunteers'
import ModMessage from '~/components/ModMessage'
import NoticeMessage from '~/components/NoticeMessage'

export default {
  components: {
    ModSupportContactGroup,
    ModSupportAddGroup,
    ModSupportListGroups,
    ModFindMessage,
    ModSupportFindUser,
    ModSupportFindGroup,
    ModSupportCheckVolunteers,
    NoticeMessage,
    ModMessage
  },
  mixins: [loginRequired],
  layout: 'modtools',
  data() {
    return {
      id: null
    }
  },
  computed: {
    messages() {
      return this.$store.getters['messages/getAll']
    }
  },
  async created() {
    this.id = this.$route.params.id
    await this.$store.dispatch('messages/clear')
    await this.$store.dispatch('chats/clear')
  }
}
</script>
<style scoped>
.max {
  max-width: 300px;
}
</style>
