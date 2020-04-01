<template>
  <div>
    <p>
      Standard Messages (aka ModConfigs) are configurations which can be applied to multiple communities so that
      they behave the same way - for example so that they have the same set of message approval/rejection buttons.
    </p>
    <div class="d-flex justify-content-between flex-wrap">
      <b-select v-model="configid" :options="configOptions" class="mb-2 font-weight-bold" />
      <b-btn variant="white" disabled>
        <v-icon name="plus" /> Add new configuration TODO
      </b-btn>
    </div>
    <b-img v-if="loading" src="~static/loader.gif" class="d-block mt-2" />
    <div v-else-if="configid && config">
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-general block href="#" variant="primary">
            General Settings
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-general" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <NoticeMessage v-if="config.protected" variant="info" class="mb-2">
              <v-icon name="lock" />
              <span v-if="parseInt(config.createdby) === myid">
                You have locked this.  Other people can use, view or copy it, but can't change or delete it.
              </span>
              <span v-else>
                This is locked.  You can use, view or copy it, but you can't change or delete it.
              </span>
            </NoticeMessage>
            <NoticeMessage v-if="config.using && config.using.length && parseInt(config.createdby) === myid" class="mb-2">
              <p>
                This config is being used. You won't be able to delete it.
              </p>
              <b-btn v-if="!showUsing" variant="link" @click="showUsing = true">
                Show who's using it
              </b-btn>
              <div v-if="showUsing">
                <div v-for="using in config.using" :key="'using-' + using.id">
                  {{ using.fullname }}
                  <span class="text-muted small">
                    <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ using.userid }}
                  </span>
                </div>
              </div>
            </NoticeMessage>
            <p v-if="config.cansee">
              You can see this because
              <span v-if="config.cansee === 'Created'">
                you created it.
              </span>
              <span v-else-if="config.cansee === 'Default'">
                it's a standard configuration everyone can see.
              </span>
              <span v-else-if="config.cansee === 'Shared'">
                it's used by <em>{{ config.sharedby.displayname }}</em> on <em>{{ config.sharedon.namedisplay }}</em>, which you also mod.
              </span>
            </p>
            <ModConfigSetting
              :configid="configid"
              name="name"
              label="Name"
              description="This is the name of this collection of standard messages.  It appears when you're choosing which collection to apply to your community."
            />
            <ModConfigSetting
              :configid="configid"
              name="fromname"
              label="'From:' name in messages"
              description="You can choose whether the mod's own name is used in standard messages."
              type="toggle"
              value-checked="My name"
              value-unchecked="Groupname Moderator"
              toggle-checked="Own Name"
              toggle-unchecked="$groupname Moderator"
              :toggle-width="200"
            />
            <ModConfigSetting
              :configid="configid"
              name="coloursubj"
              label="Colour-code subjects?"
              description="Whether subjects are coded green/red based to indicate that they are correctly formatted."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
            />
            <ModConfigSetting
              :configid="configid"
              name="subjlen"
              label="Subject length warning"
              description="Keeping subject lines short is better for small screens."
            />
            <ModConfigSetting
              :configid="configid"
              name="subjreg"
              label="Regular expression for colour-coding"
              description="Regular expressions can be difficult; test changes at http://www.phpliveregex.com"
            />
            <ModConfigSetting
              :configid="configid"
              name="network"
              label="$network substitution string"
              description="Normally you'd leave this set to Freegle or blank (same thing)."
            />
            <ModConfigSetting
              v-if="config.createdby"
              :configid="configid"
              name="protected"
              label="Locked against changes?"
              description="You can set this read-only so that only the person who created it can make changes"
              type="toggle"
              toggle-checked="Locked"
              toggle-unchecked="Unlocked"
              :disabled="config.createdby && parseInt(config.createdby) !== myid"
            />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-pendingmessages block href="#" variant="primary">
            Pending Messages
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-pendingmessages" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <ModSettingsStandardMessageSet cc="ccrejectto" addr="ccrejectaddr" :types="['Approve', 'Reject', 'Leave', 'Delete', 'Edit']" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-approvedmessages block href="#" variant="primary">
            Approved Messages
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-approvedmessages" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <ModSettingsStandardMessageSet cc="ccfollowupto" addr="ccfollowupaddr" :types="['Leave Approved Message', 'Delete Approved Message', 'Edit']" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-pendingmembers block href="#" variant="primary">
            Pending Members
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-pendingmembers" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <ModSettingsStandardMessageSet cc="ccrejmembto" addr="ccrejmembaddr" :types="['Approve Member', 'Reject Member', 'Leave Member']" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-approvedmembers block href="#" variant="primary">
            Approved Members
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-approvedmembers" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <ModSettingsStandardMessageSet cc="ccrejmembto" addr="ccrejmembaddr" :types="['Leave Approved Member', 'Delete Approved Member']" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <div class="d-flex justify-content-between flex-wrap">
        <b-btn variant="white" disabled>
          <v-icon name="plus" /> Copy TODO
        </b-btn>
        <b-btn variant="white" disabled>
          <v-icon name="trash-alt" /> Delete TODO
        </b-btn>
      </div>
    </div>
  </div>
</template>
<script>
import ModConfigSetting from './ModConfigSetting'
import NoticeMessage from './NoticeMessage'
import ModSettingsStandardMessageSet from './ModSettingsStandardMessageSet'
export default {
  components: {
    ModSettingsStandardMessageSet,
    NoticeMessage,
    ModConfigSetting
  },
  data: function() {
    return {
      configid: null,
      loading: false,
      showUsing: false
    }
  },
  computed: {
    configOptions() {
      const ret = [
        {
          value: null,
          text: '-- Please choose --'
        }
      ]

      const configs = this.$store.getters['modconfigs/configs']

      configs.forEach(c => {
        ret.push({
          value: c.id,
          text: c.name
        })
      })

      return ret
    },
    config() {
      return this.$store.getters['modconfigs/current']
    }
  },
  watch: {
    async configid(newval) {
      this.loading = true
      this.showUsing = false

      await this.$store.dispatch('modconfigs/fetchConfig', {
        id: newval,
        configuring: true
      })

      this.loading = false
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

input,
select {
  max-width: 300px;
}
</style>
