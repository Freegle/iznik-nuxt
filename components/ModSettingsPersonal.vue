<template>
  <div>
    <b-form-group label="Your visible name">
      <b-form-text class="mb-2">
        This is your name as displayed publicly to other users, including in the $myname substitution string.
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
  </div>
</template>
<script>
import SpinButton from './SpinButton'
const OurToggle = () => import('@/components/OurToggle')

export default {
  components: { SpinButton, OurToggle },
  data: function() {
    return {}
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

input {
  max-width: 300px;
}
</style>
