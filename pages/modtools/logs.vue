<template>
  <div class="bg-white">
    <b-tabs content-class="mt-3" card>
      <b-tab active @click="clear('messages', true)">
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
                variant="primary"
                :disabled="busy"
                @click="search"
              >
                <v-icon name="search" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-tab>
      <b-tab to="/modtools/logs/members" @click="clear('memberships', true)">
        <template v-slot:title>
          <h2 class="ml-2 mr-2">
            Members
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
                variant="primary"
                @click="search"
              >
                <v-icon name="search" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-tab>
    </b-tabs>
    <ModLogs
      v-if="groupid"
      ref="logs"
      :key="'modlogs-' + bump"
      class="bg-white"
      :groupid="groupid"
      @busy="busy=true"
      @idle="busy=false"
    />
  </div>
</template>
<script>
import ModLogs from '@/components/ModLogs'
import loginRequired from '@/mixins/loginRequired.js'
import GroupSelect from '../../components/GroupSelect'

export default {
  layout: 'modtools',
  components: { GroupSelect, ModLogs },
  mixins: [loginRequired],
  data: function() {
    return {
      bump: 0,
      groupid: null,
      type: 'messages',
      term: null,
      busy: false
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
    clear(type, term) {
      this.bump = Date.now()
      this.type = type

      if (term) {
        this.term = null
      }

      this.$store.dispatch('logs/setParams', {
        type: type,
        search: this.term ? this.term.trim() : null
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
