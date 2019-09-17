<template>
  <div v-if="me">
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6" class="p-0">
        <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
          <template v-slot:header>
            <v-icon name="globe-europe" /> Your Public Profile
          </template>
          <b-card-body class="p-0 pt-1">
            <p class="text-muted">
              This is what other freeglers can see about you.
              <b-btn variant="success" class="float-right" @click="viewProfile">
                <v-icon name="eye" /> View Your Profile
              </b-btn>
            </p>
            <b-row>
              <b-col cols="12" sm="6">
                <b-input-group>
                  <b-input v-model="me.displayname" placeholder="Your name" />
                  <b-input-group-append>
                    <b-button variant="white" @click="saveName">
                      <v-icon name="save" />&nbsp;Save
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col cols="12" sm="6" md="4" lg="3">
                <b-card>
                  <b-card-body class="text-center p-2">
                    <b-img-lazy
                      v-if="me.profile.url"
                      rounded="circle"
                      thumbnail
                      class="profile"
                      alt="Profile picture"
                      title="Profile"
                      :src="profileurl"
                      @error.native="brokenImage"
                    />
                    <br>
                    <toggle-button
                      :value="useprofile"
                      class="mt-2"
                      :height="30"
                      :width="100"
                      :font-size="14"
                      :sync="true"
                      :labels="{checked: 'Show', unchecked: 'Hide'}"
                      color="#61AE24"
                      @change="changeUseProfile"
                    />
                    <br>
                    <b-btn variant="primary" class="mt-2">
                      <v-icon name="camera" /> Upload photo
                    </b-btn>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col cols="12" sm="6" md="8" lg="9">
                <b-card>
                  <b-card-body class="text-left p-2">
                    <div v-if="aboutme">
                      &quot;{{ aboutme }}&quot;
                      <br>
                      <b-btn variant="white" class="mt-2" @click="addAbout">
                        <v-icon name="pen" /> Edit
                      </b-btn>
                    </div>
                    <div v-else>
                      <b-alert variant="info" show>
                        Please write something to let other freeglers know a bit about you. It makes freegling more fun and helps get a better response when you're replying to OFFERs.
                      </b-alert>
                      <b-btn variant="white" class="mt-2" @click="addAbout">
                        <v-icon name="pen" /> Introduce yourself
                      </b-btn>
                    </div>
                  </b-card-body>
                </b-card>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
        <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
          <template v-slot:header>
            <v-icon name="lock" /> Your Account Settings
          </template>
          <b-card-body class="p-0 pt-1">
            <p class="text-muted">
              This information is private.  Other freeglers can't see it.
            </p>
            <b-row>
              <b-col cols="12" sm="6">
                <b-form-group
                  label="Your email address:"
                >
                  <b-input-group id="input-email">
                    <b-input v-model="me.email" placeholder="Your email" label="Your email address" />
                    <b-input-group-append>
                      <b-button variant="white" @click="saveEmail">
                        <v-icon v-if="savingEmail" name="sync" class="text-success fa-spin" />
                        <v-icon v-else-if="savedEmail" name="check" class="text-success" />
                        <v-icon v-else name="save" />
                        Save
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" sm="6">
                <b-form-group
                  label="Your password:"
                >
                  <b-input-group id="input-password">
                    <b-input v-model="me.password" type="password" placeholder="Your password" label="Your password" />
                    <b-input-group-append>
                      <b-button variant="white" @click="savePassword">
                        <v-icon v-if="savingPassword" name="sync" class="text-success fa-spin" />
                        <v-icon v-else-if="savedPassword" name="check" class="text-success" />
                        <v-icon v-else name="save" />&nbsp;
                        Save
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <b-form-group
                  label="Your postcode:"
                  class="d-inline"
                >
                  <b-input-group id="input-postcode">
                    <postcode @selected="selectPostcode" />
                  </b-input-group>
                </b-form-group>

                <b-button variant="white" size="lg" class="mb-2 d-inline" @click="savePostcode">
                  <v-icon v-if="savingPostcode" name="sync" class="text-success fa-spin" />
                  <v-icon v-else-if="savedPostcode" name="check" class="text-success" />
                  <v-icon v-else name="save" />&nbsp;
                  Save
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-btn variant="primary" size="lg" to="/unsubscribe">
                  Unsubscribe
                </b-btn>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
        <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
          <template v-slot:header>
            <v-icon name="envelope" /> Your Mail Settings
          </template>
          <b-card-body class="p-0 pt-1">
            <p class="text-muted">
              You can control the type and frequency of emails we send you.
            </p>
            <div v-if="emailSimple" />
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
    <AboutMeModal ref="aboutmemodal" @change="update" />
    <ProfileModal :id="me ? me.id : null" ref="profilemodal" />
    <EmailConfirmModal ref="emailconfirm" />
  </div>
</template>
<style scoped>
.profile {
  width: 100px !important;
  height: 100px !important;
}
</style>
<script>
import EmailConfirmModal from '../components/EmailConfirmModal'
import loginRequired from '@/mixins/loginRequired.js'
const AboutMeModal = () => import('~/components/AboutMeModal')
const ProfileModal = () => import('~/components/ProfileModal')
const Postcode = () => import('~/components/Postcode')
// const GroupSelect = () => import('~/components/GroupSelect.vue')

export default {
  components: {
    EmailConfirmModal,
    // GroupSelect,
    AboutMeModal,
    ProfileModal,
    Postcode
  },
  mixins: [loginRequired],
  data: function() {
    return {
      me: null,
      pc: null,
      savingPostcode: false,
      savedPostcode: false,
      savingEmail: false,
      savedEmail: false,
      savingPassword: false,
      savedPassword: false
    }
  },
  computed: {
    aboutme() {
      const ret = this.me && this.me.aboutme ? this.me.aboutme.text : ''
      return ret
    },
    profileurl() {
      return this.me && this.useprofile
        ? this.me.profile.url
        : '/defaultprofile.png'
    },
    useprofile() {
      let ret = true

      if (this.me && this.me.settings) {
        if (Object.keys(this.me.settings).includes('useprofile')) {
          ret = this.me.settings.useprofile
        }
      }

      return ret
    },
    emailSimple() {
      // If we have the same settings on all groups, then we can show a simplified view.
      console.log('Me', this.me)
      return false
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('auth/fetchUser', {
      components: ['me', 'groups', 'aboutme']
    })

    const me = store.getters['auth/user']()

    // useprofile might not be defiled

    return {
      me: me
    }
  },
  methods: {
    async update() {
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme'],
        force: true
      })

      const me = this.$store.getters['auth/user']()
      this.me = me
    },

    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    },
    addAbout() {
      this.$refs.aboutmemodal.show()
    },
    viewProfile() {
      this.$refs.profilemodal.show()
    },
    async changeUseProfile(c, e) {
      const settings = this.me.settings
      settings.useprofile = c.value
      this.me = await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    },
    async saveName() {
      this.me = await this.$store.dispatch('auth/saveAndGet', {
        displayname: this.me.displayname
      })
    },
    selectPostcode(pc) {
      this.pc = pc
    },
    async savePassword() {
      this.savingPassword = true

      if (this.me.password) {
        this.me = await this.$store.dispatch('auth/saveAndGet', {
          password: this.me.password
        })
      }

      this.savingPassword = false
      this.savedPassword = true
      setTimeout(() => {
        this.savedPassword = false
      }, 2000)
    },
    async saveEmail() {
      this.savingEmail = true

      if (this.me.email) {
        const ret = await this.$store.dispatch('auth/saveEmail', {
          email: this.me.email
        })

        if (ret && ret.data && ret.data.ret === 10) {
          this.$refs.emailconfirm.show()
        }
      }

      this.savingEmail = false
      this.savedEmail = true
      setTimeout(() => {
        this.savedEmail = false
      }, 2000)
    },
    async savePostcode() {
      const settings = this.me.settings
      this.savingPostcode = true

      if (!settings.mylocation || settings.mylocation.id !== this.pc.id) {
        settings.mylocation = this.pc
        this.me = await this.$store.dispatch('auth/saveAndGet', {
          settings: settings
        })
      }

      this.savingPostcode = false
      this.savedPostcode = true
      setTimeout(() => {
        this.savedPostcode = false
      }, 2000)
    }
  }
}
</script>
