<template>
  <div class="bg-white">
    <b-tabs content-class="mt-3" card>
      <b-tab active @click="clear('messages')">
        <template v-slot:title>
          <h2 class="ml-2 mr-2">
            Messages
          </h2>
        </template>
        <div class="d-flex flex-wrap">
          <GroupSelect v-model="groupid" modonly />
          <b-input-group class="flex max">
            <b-form-input
              v-model="term"
              type="text"
              placeholder="Search name/email/subject"
              autocapitalize="none"
              @keyup.native.enter="search"
            />
            <b-input-group-append>
              <b-button
                variant="success"
                @click="search"
              >
                <v-icon name="search" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-tab>
      <b-tab to="/modtools/logs/members" @click="clear('memberships')">
        <template v-slot:title>
          <h2 class="ml-2 mr-2">
            Members
          </h2>
        </template>
        <GroupSelect v-model="groupid" modonly />
      </b-tab>
    </b-tabs>
    <ModLogs v-if="groupid" :key="'modlogs-' + bump" class="bg-white" :groupid="groupid" />
  </div>
</template>
<script>
import GroupSelect from '../../components/GroupSelect'
import ModLogs from '@/components/ModLogs'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  layout: 'modtools',
  components: { GroupSelect, ModLogs },
  mixins: [loginRequired],
  data: function() {
    return {
      bump: 0,
      groupid: null,
      type: 'messages',
      term: null
    }
  },
  watch: {
    groupid() {
      this.clear(this.type)
    }
  },
  mounted() {
    this.clear(this.type)
  },
  methods: {
    clear(type) {
      this.bump = Date.now()
      this.type = type
      this.$store.dispatch('logs/setParams', {
        type: type,
        search: this.term
      })

      this.$store.dispatch('logs/clear')
    },
    search() {
      this.clear(this.type)
    }
  }
}
</script>
<style scoped>
.max {
  max-width: 300px;
}
</style>
