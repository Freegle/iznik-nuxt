<template>
  <div>
    <b-form-group label="Your visible name">
      <b-form-text class="mb-2">
        This is your name as displayed publicly to other users, including in the <em>$myname</em> substitution string.
      </b-form-text>
      <b-input-group>
        <b-input v-model="me.displayname" placeholder="Your name" />
        <b-input-group-append>
          <SpinButton variant="white" name="save" label="Save" :handler="saveName" />
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-form-group label="Your email address">
      <b-form-text class="mb-2">
        Anything we mail to you, we'll mail to this email address.
      </b-form-text>
      <b-input-group id="input-email">
        <b-input v-model="me.email" placeholder="Your email" label="Your email address" type="email" />
        <b-input-group-append>
          <SpinButton variant="white" name="save" label="Save" :handler="saveEmail" />
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <b-form-group label="Moderation Notifications (Active)">
      <b-form-text class="mb-2">
        For groups that you're an active mod on, we will mail you when there is moderation work to do which has been
        outstanding for more than a certain time. You can control the frequency or disable this here. We only mail you
        between 8am and 10pm.
      </b-form-text>
      <b-select v-model="modnotifs" :options="modNotifOptions" class="mb-2 font-weight-bold" />
    </b-form-group>
    <b-form-group label="Moderation Notifications (Backup)">
      <b-form-text class="mb-2">
        This is for groups where you're a backup mod. You'd usually set this to a higher value than the previous
        setting so that the active mods will get notified first.
      </b-form-text>
      <b-select v-model="backupmodnotifs" :options="modNotifOptions" class="mb-2 font-weight-bold" />
    </b-form-group>
    <b-form-group label="Play Beep">
      <b-form-text class="mb-2">
        Play beep when new ModTools work arrives.
      </b-form-text>
      <OurToggle
        v-model="beep"
        class="mt-2"
        :height="30"
        :width="150"
        :font-size="14"
        :sync="true"
        :labels="{checked: 'Play beep', unchecked: 'Stay quiet'}"
        color="#61AE24"
      />
    </b-form-group>
    <b-form-group label="Show me as a volunteer?">
      <b-form-text class="mb-2">
        We can show members who the volunteers on a group are, to make it seem more friendly. You can choose whether we show you.
      </b-form-text>
      <OurToggle
        v-model="showme"
        class="mt-2"
        :height="30"
        :width="150"
        :font-size="14"
        :sync="true"
        :labels="{checked: 'Show me', unchecked: 'Hide me'}"
        color="#61AE24"
      />
    </b-form-group>
    <b-form-group label="Email me about ChitChat?">
      <b-form-text class="mb-2">
        Your members may post in the ChitChat, perhaps to introduce themselves, or perhaps because they have
        problems. Replying to these posts helps them and makes Freegle friendlier. We only mail you about communities
        you are an active mod on.
      </b-form-text>
      <OurToggle
        v-model="modnotifnewsfeed"
        class="mt-2"
        :height="30"
        :width="150"
        :font-size="14"
        :sync="true"
        :labels="{checked: 'Mail me', unchecked: 'Don\'t mail'}"
        color="#61AE24"
      />
    </b-form-group>
    <b-form-group label="Enter send vs newline">
      <b-form-text class="mb-2">
        On ModTools, normally enter/return adds a new line.  This the opposite way round from on the Freegle site,
        where sending the message is the best compromise option given the limitations of what is technically possible
        for websites when used from mobiles.  If you prefer enter to send on ModTools too, you can change the setting on
        this device.
      </b-form-text>
      <OurToggle
        v-model="enterAddsNewLine"
        class="mt-2"
        :height="30"
        :width="150"
        :font-size="14"
        :sync="true"
        :labels="{checked: 'Send message', unchecked: 'Insert new line'}"
        color="#61AE24"
      />
    </b-form-group>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
const OurToggle = () => import('@/components/OurToggle')

export default {
  components: { SpinButton, OurToggle },
  data: function() {
    return {
      modNotifOptions: [
        { text: 'Daily', value: 24 },
        { text: 'After 12 hours', value: 12 },
        { text: 'After 4 hours', value: 4 },
        { text: 'After 2 hours', value: 2 },
        { text: 'After 1 hour', value: 1 },
        { text: 'Immediately', value: 0 },
        { text: 'Never', value: -1 }
      ]
    }
  },
  computed: {
    beep: {
      get() {
        return Object.keys(this.me.settings).includes('playbeep')
          ? Boolean(this.me.settings.playbeep)
          : false
      },
      set(newval) {
        this.saveSetting('playbeep', newval)
      }
    },
    showme: {
      get() {
        return Object.keys(this.me.settings).includes('showmod')
          ? Boolean(this.me.settings.showmod)
          : true
      },
      set(newval) {
        this.saveSetting('showmod', newval)
      }
    },
    modnotifnewsfeed: {
      get() {
        return Object.keys(this.me.settings).includes('modnotifnewsfeed')
          ? Boolean(this.me.settings.modnotifnewsfeed)
          : true
      },
      set(newval) {
        this.saveSetting('modnotifnewsfeed', newval)
      }
    },
    modnotifs: {
      get() {
        return Object.keys(this.me.settings).includes('modnotifs')
          ? parseInt(this.me.settings.modnotifs)
          : 4
      },
      set(newval) {
        this.saveSetting('modnotifs', newval)
      }
    },
    backupmodnotifs: {
      get() {
        return Object.keys(this.me.settings).includes('backupmodnotifs')
          ? parseInt(this.me.settings.backupmodnotifs)
          : 12
      },
      set(newval) {
        this.saveSetting('backupmodnotifs', newval)
      }
    },
    enterAddsNewLine: {
      get() {
        return this.$store.getters['misc/get']('enternewlinemt')
      },
      set(newval) {
        this.$store.dispatch('misc/set', {
          key: 'enternewlinemt',
          value: newval
        })
      }
    }
  },
  methods: {
    async saveName() {
      await this.$store.dispatch('auth/saveAndGet', {
        displayname: this.me.displayname
      })
    },
    async saveEmail() {
      if (this.me.email) {
        const data = await this.$store.dispatch('auth/saveEmail', {
          email: this.me.email
        })

        if (data && data.ret === 10) {
          this.waitForRef('emailconfirm', () => {
            this.$refs.emailconfirm.show()
          })
        }
      }
    },
    async saveSetting(name, val) {
      const settings = this.me.settings
      settings[name] = val
      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
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
