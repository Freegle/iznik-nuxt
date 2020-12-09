<template>
  <div>
    <p>
      Standard Messages (aka ModConfigs) are configurations which can be applied to multiple communities so that
      they behave the same way - mostly so that they have the same set of approval/rejection buttons for
      messages/members.
    </p>
    <p>
      You configure different sets of buttons for different pages, so there's a section for each.
    </p>
    <div class="d-flex justify-content-between flex-wrap">
      <b-select v-model="configid" :options="configOptions" class="mb-2 font-weight-bold" />
      <div>
        <b-input-group>
          <b-input v-model="newconfigname" />
          <b-input-group-append>
            <SpinButton variant="white" name="plus" label="Create" :handler="create" />
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <b-img v-if="loading" src="~static/loader.gif" class="d-block mt-2" />
    <div v-else-if="configid && config">
      <NoticeMessage v-if="config.protected" variant="info" class="mb-2">
        <v-icon name="lock" />
        <span v-if="parseInt(config.createdby) === myid">
          You have locked this.  Other people can use, view or copy it, but can't change or delete it.
        </span>
        <span v-else>
          This is locked by #{{ config.createdby }}.  You can use, view or copy it, but you can't change or delete it.
        </span>
      </NoticeMessage>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-general block href="#" variant="secondary">
            General Settings
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-general" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
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
              :disabled="locked"
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
              :disabled="locked"
            />
            <ModConfigSetting
              :configid="configid"
              name="coloursubj"
              label="Colour-code subjects?"
              description="Whether subjects are coded green/red based to indicate that they are correctly formatted."
              type="toggle"
              toggle-checked="Yes"
              toggle-unchecked="No"
              :disabled="locked"
            />
            <ModConfigSetting
              :configid="configid"
              name="subjlen"
              label="Subject length warning"
              description="Keeping subject lines short is better for small screens."
              :disabled="locked"
            />
            <ModConfigSetting
              :configid="configid"
              name="subjreg"
              label="Regular expression for colour-coding"
              description="Regular expressions can be difficult; test changes at http://www.phpliveregex.com"
              :disabled="locked"
            />
            <ModConfigSetting
              :configid="configid"
              name="network"
              label="$network substitution string"
              description="Normally you'd leave this set to Freegle or blank (same thing)."
              :disabled="locked"
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
              :disabled="locked"
            />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-pendingmessages block href="#" variant="secondary">
            Pending Messages
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-pendingmessages" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <ModSettingsStandardMessageSet cc="ccrejectto" addr="ccrejectaddr" :types="['Approve', 'Reject', 'Leave', 'Delete', 'Edit']" :locked="locked" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-approvedmessages block href="#" variant="secondary">
            Approved Messages
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-approvedmessages" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <ModSettingsStandardMessageSet cc="ccfollowupto" addr="ccfollowupaddr" :types="['Leave Approved Message', 'Delete Approved Message', 'Edit']" :locked="locked" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-2 mt-1">
        <b-card-header>
          <b-btn v-b-toggle.accordion-approvedmembers block href="#" variant="secondary">
            Approved Members
          </b-btn>
        </b-card-header>
        <b-collapse id="accordion-approvedmembers" accordion="settings-accordion" role="tabpanel">
          <b-card-body>
            <ModSettingsStandardMessageSet cc="ccrejmembto" addr="ccrejmembaddr" :types="['Leave Approved Member', 'Delete Approved Member']" :locked="locked" />
          </b-card-body>
        </b-collapse>
      </b-card>
      <div class="d-flex justify-content-between">
        <b-input-group class="mt-2">
          <b-input v-model="copyconfigname" placeholder="Copy this whole config to..." />
          <b-input-group-append>
            <SpinButton variant="white" name="plus" label="Copy" :handler="copy" :disabled="!copyconfigname" />
          </b-input-group-append>
        </b-input-group>
        <b-btn v-if="!locked" variant="white" class="mt-2" @click="deleteIt">
          <v-icon name="trash-alt" /> Delete
        </b-btn>
      </div>
      <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete: ' + config.name" @confirm="deleteConfirmed" />
    </div>
  </div>
</template>
<script>
import waitForRef from '@/mixins/waitForRef'
import ModConfigSetting from './ModConfigSetting'
import NoticeMessage from './NoticeMessage'
import ModSettingsStandardMessageSet from './ModSettingsStandardMessageSet'
import SpinButton from './SpinButton'
import ConfirmModal from './ConfirmModal'

export default {
  components: {
    ConfirmModal,
    SpinButton,
    ModSettingsStandardMessageSet,
    NoticeMessage,
    ModConfigSetting
  },
  mixins: [waitForRef],
  data: function() {
    return {
      loading: false,
      showUsing: false,
      newconfigname: null,
      copyconfigname: null,
      showDeleteModal: false
    }
  },
  computed: {
    configid: {
      get() {
        const config = this.$store.getters['misc/get']('settingsconfig')
        return config || null
      },
      async set(newval) {
        await this.$store.dispatch('misc/set', {
          key: 'settingsconfig',
          value: newval
        })
      }
    },
    locked() {
      return Boolean(
        this.config &&
          this.config.protected &&
          parseInt(this.config.createdby) !== this.myid
      )
    },
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
    configid: {
      immediate: true,
      handler: async function(newval) {
        this.loading = true
        this.showUsing = false

        if (newval) {
          await this.$store.dispatch('modconfigs/fetchConfig', {
            id: newval,
            configuring: true
          })
        }

        this.loading = false
      }
    }
  },
  beforeDestroy() {
    // Refetch the configs into the session so that if we go to a page where the config is used, the changes will
    // be reflected.
    this.$store.dispatch('modconfigs/fetch', {
      all: true
    })
  },
  methods: {
    async create() {
      this.configid = await this.$store.dispatch('modconfigs/add', {
        name: this.newconfigname,
        configuring: true
      })

      await this.$store.dispatch('modconfigs/fetch', {
        all: true
      })
    },
    async copy() {
      this.configid = await this.$store.dispatch('modconfigs/add', {
        name: this.copyconfigname,
        id: this.config.id,
        configuring: true
      })

      await this.$store.dispatch('modconfigs/fetch', {
        all: true
      })
    },
    deleteIt() {
      this.showDeleteModal = true
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    async deleteConfirmed() {
      await this.$store.dispatch('modconfigs/delete', {
        id: this.configid
      })

      await this.$store.dispatch('modconfigs/fetch', {
        all: true
      })

      this.configid = null
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
