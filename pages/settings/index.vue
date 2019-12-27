<template>
  <div v-if="me && me.settings && me.settings.notifications">
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
              <b-btn variant="success" class="float-right d-none d-sm-block" @click="viewProfile">
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
            <b-row class="d-block d-sm-none">
              <b-col>
                <b-btn variant="success" block class="mt-2" @click="viewProfile">
                  <v-icon name="eye" /> View Your Profile
                </b-btn>
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
                <b-card nobody>
                  <b-card-body class="text-left p-0 p-sm-2">
                    <div v-if="aboutme">
                      &quot;{{ aboutme }}&quot;
                      <br>
                      <b-btn variant="white" class="mt-2" @click="addAbout">
                        <v-icon name="pen" /> Edit
                      </b-btn>
                    </div>
                    <div v-else>
                      <notice-message>
                        Please write something to let other freeglers know a bit about you. It makes freegling more fun and helps get a better response when you're replying to OFFERs.
                      </notice-message>
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
            <v-icon name="globe-europe" /> Arranging Collections
          </template>
          <b-card-body class="p-0 pt-1">
            <p class="text-muted">
              This is information you can choose to send to other freeglers when arranging collections.
            </p>
            <b-row>
              <b-col>
                <h4>Availability</h4>
                <p class="mt-2">
                  We can help you arrange a collection time if you tell us when you're available over the next
                  few days.
                </p>
                <b-btn variant="white" @click="availability">
                  <v-icon name="calendar-alt" /> Edit Availability
                </b-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h4 class="mt-2">
                  Address Book
                </h4>
                <p class="mt-2">
                  You can save your address and send it to other freeglers, then you don't have to type it each
                  time.
                </p>
                <b-btn variant="white" @click="addressBook">
                  <v-icon name="address-book" /> Open Address Book
                </b-btn>
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
                    <postcode :focus="false" @selected="selectPostcode" />
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
                <hr>
                <b-btn variant="primary" size="lg" to="/unsubscribe">
                  Unsubscribe
                </b-btn>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
        <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
          <template v-slot:header>
            <v-icon name="envelope" /> Community Mail Settings
          </template>
          <div v-if="me.groups.length">
            <p>You can pause regular emails for a while, for example if you're on holiday.</p>
            <toggle-button
              v-model="emailsOn"
              :height="34"
              :width="150"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Mails On', unchecked: 'Mails Paused'}"
              color="#61AE24"
              @change="changeHolidayToggle"
            />
            <span v-if="!emailsOn">
              <span class="align-top ml-2 mr-2">
                until
              </span>
              <date-picker
                :value="me.onholidaytill"
                lang="en"
                placeholder="Set a date"
                value-type="format"
                :not-before="new Date()"
                :not-after="(new Date()).setDate((new Date()).getDate() + 30)"
                :confirm="true"
                :clearable="true"
                class="align-top"
                @confirm="changeHolidayDate"
              />
            </span>
            <b-card-body class="p-0 pt-1">
              <p>
                You can control the type and frequency of emails from your Freegle communities.
              </p>
              <div v-if="simpleSettings && !showAdvanced">
                <div>
                  <SettingsGroup :emailfrequency.sync="emailSimple" :volunteeringallowed.sync="volunteeringSimple" :eventsallowed.sync="eventSimple" />
                  <p class="text-muted">
                    Occasionally we may also send ADMIN mails about the running of Freegle.
                  </p>
                  <hr>
                  <a v-if="!showAdvanced" href="#" @click="toggleAdvanced">
                    Show advanced settings
                  </a>
                </div>
              </div>
              <div v-else>
                <div v-if="me">
                  <div v-for="group in me.groups" :key="'settingsgroup-' + group.id" class="list-unstyled">
                    <b-card v-if="group.type === 'Freegle'" class="nocardbot">
                      <b-card-title>
                        <b-img-lazy rounded thumbnail alt="Community profile picture" :src="group.profile" class="float-right groupprofile" />
                        {{ group.namedisplay }}
                        <span v-if="group.role === 'Moderator' || group.role === 'Owner'">
                          <v-icon name="crown" class="text-success" />
                        </span>
                      </b-card-title>
                      <b-card-body class="p-0 pt-2">
                        <SettingsGroup
                          :groupid="group.id"
                          :emailfrequency="group.mysettings ? group.mysettings.emailfrequency : 24"
                          :volunteeringallowed="Boolean(group.mysettings ? group.mysettings.volunteeringallowed : true)"
                          :eventsallowed="Boolean(group.mysettings ? group.mysettings.eventsallowed : true)"
                          :leave="group.role === 'Member'"
                          @change="groupChange"
                          @leave="leaveGroup(group.id)"
                        />
                      </b-card-body>
                    </b-card>
                  </div>
                </div>
                <p class="text-muted mt-2">
                  Occasionally we may also send ADMIN mails about the running of Freegle.
                </p>
              </div>
            </b-card-body>
          </div>
          <div v-else>
            You're not a member of any communities yet.
          </div>
        </b-card>
        <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
          <template v-slot:header>
            <v-icon name="bell" /> Chat Notifications
          </template>
          <b-card-body class="p-0 pt-1">
            <p class="text-muted">
              <v-icon name="lock" /> Other freeglers won't see this.
            </p>
            <p class="text-muted">
              Messages from other freeglers will appear in the <em>Chat</em> section.  We can also notify you
              in other ways.
            </p>
            <notice-message variant="warning">
              Email doesn't always get through, so check your spam folders, and check <em>Chat</em> on here occasionally.
            </notice-message>
            <hr>
            <h5>Text Alerts</h5>
            <p>We can send you SMS alerts to your phone.</p>
            <b-row>
              <b-col cols="12" md="8">
                <b-form-group
                  class="d-inline"
                >
                  <b-input-group>
                    <b-input v-model="me.phone" placeholder="Your mobile number" />
                    <b-input-group-append>
                      <b-button variant="white" @click="savePhone">
                        <v-icon v-if="savingPhone" name="sync" class="text-success fa-spin" />
                        <v-icon v-else-if="savedPhone" name="check" class="text-success" />
                        <v-icon v-else name="save" />
                        Save
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col cols-md="4" class="p-1">
                <b-btn v-if="me.phone" variant="white" class="float-right d-inline mt-4 mr-3" @click="removePhone">
                  <v-icon v-if="removingPhone" name="sync" class="text-success fa-spin" />
                  <v-icon v-else-if="removedPhone" name="check" class="text-success" />
                  <v-icon v-else name="trash-alt" />
                  Remove
                </b-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <!-- TODO - This should ideally be a b-alert when it pops up but if the page loads with it already present then it should be a notice-message component -->
                <b-alert v-if="me.phone" show variant="info">
                  <p>
                    It costs Freegle to send these - if you can, please:
                  </p>
                  <b-btn variant="primary" to="https://freegle.in/paypalfundraiser" target="_blank">
                    Donate to help
                  </b-btn>
                </b-alert>
              </b-col>
            </b-row>
            <h5>Email Alerts</h5>
            <p>
              Mail me chat messages from other freeglers I'm talking to about OFFERs and WANTEDs.
            </p>
            <toggle-button
              v-model="me.settings.notifications.email"
              :height="30"
              :width="150"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Emails On', unchecked: 'Emails Off'}"
              color="#61AE24"
              @change="changeNotification($event, 'email')"
            />
            <p>
              We can email you a copy of chat messages you send on here.
            </p>
            <toggle-button
              v-model="me.settings.notifications.emailmine"
              :height="30"
              :width="150"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Email Mine', unchecked: 'Don\'t Email Mine'}"
              color="#61AE24"
              @change="changeNotification($event, 'emailmine')"
            />
            <p>
              We can email you if there's an unread notification on here, or about recent ChitChat posts from nearby freeglers.
            </p>
            <toggle-button
              v-model="relevantallowed"
              :height="30"
              :width="150"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Send Them', unchecked: 'No Thanks'}"
              color="#61AE24"
              @change="changeRelevant"
            />
            <h5>Other Alerts</h5>
            <p>
              Apps for your
              <a href="https://play.google.com/store/apps/details?id=org.ilovefreegle.direct" target="_blank">Android</a> or
              <a href="https://itunes.apple.com/gb/app/freegle/id970045029?ls=1&mt=8" target="_blank">IOS</a> phone/tablet.
            </p>
            <toggle-button
              v-model="me.settings.notifications.app"
              :height="30"
              :width="220"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'App Notifications On', unchecked: 'App Notifications Off'}"
              color="#61AE24"
              @change="changeNotification($event, 'app')"
            />
            <p>
              You'll see a popup asking if we can send these. They appear on your taskbar, or on mobile at the top. Also known as "web push" notifications.
            </p>
            <toggle-button
              v-model="me.settings.notifications.push"
              :height="30"
              :width="220"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Browser Popups On', unchecked: 'Browser Popups Off'}"
              color="#61AE24"
              @change="changeNotification($event, 'push')"
            />
            <p>
              This is the red bell icon you know and love. They don't show on mobile - Facebook doesn't do that.
            </p>
            <toggle-button
              v-model="me.settings.notifications.facebook"
              :height="30"
              :width="220"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Facebook Notifications On', unchecked: 'Facebook Notifications Off'}"
              color="#61AE24"
              @change="changeNotification($event, 'facebook')"
            />
          </b-card-body>
        </b-card>
        <br class="mb-4">
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
    <AboutMeModal ref="aboutmemodal" @change="update" />
    <ProfileModal :id="me ? me.id : null" ref="profilemodal" />
    <EmailConfirmModal ref="emailconfirm" />
    <AvailabilityModal ref="availabilitymodal" :thisuid="me.id" />
    <AddressModal ref="addressModal" />
  </div>
</template>

<style scoped>
.profile {
  width: 100px !important;
  height: 100px !important;
}

.groupprofile {
  height: 100px !important;
}

.nocardbot .card-body {
  padding-bottom: 0px;
}
</style>

<script>
import 'vue-awesome/icons/address-book'
import 'vue-awesome/icons/crown'
import 'vue-awesome/icons/bell'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/envelope'
import 'vue-awesome/icons/calendar-alt'
import 'vue-awesome/icons/camera'
import 'vue-awesome/icons/globe-europe'
import 'vue-awesome/icons/lock'
import 'vue-awesome/icons/pen'
import 'vue-awesome/icons/save'
import 'vue-awesome/icons/sync'
import 'vue-awesome/icons/trash-alt'

// TODO MINOR Click on group name or icon to go to group once we have /mygroups/id
import Vue from 'vue'
import EmailConfirmModal from '~/components/EmailConfirmModal'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead'
const AboutMeModal = () => import('~/components/AboutMeModal')
const AvailabilityModal = () => import('~/components/AvailabilityModal')
const AddressModal = () => import('~/components/AddressModal')
const ProfileModal = () => import('~/components/ProfileModal')
const Postcode = () => import('~/components/Postcode')
const SettingsGroup = () => import('~/components/SettingsGroup')
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    EmailConfirmModal,
    AboutMeModal,
    AvailabilityModal,
    AddressModal,
    ProfileModal,
    Postcode,
    SettingsGroup,
    NoticeMessage
  },
  mixins: [loginRequired, buildHead],
  data: function() {
    return {
      me: null,
      emailsOn: null,
      pc: null,
      showAdvanced: false,
      savingPostcode: false,
      savedPostcode: false,
      savingEmail: false,
      savedEmail: false,
      savingPassword: false,
      savedPassword: false,
      savingPhone: false,
      savedPhone: false,
      removingPhone: false,
      removedPhone: false
    }
  },
  computed: {
    relevantallowed: {
      // This is 1/0 in the model whereas we want Boolean.
      set(val) {
        Vue.set(this, 'me.relevantallowed', val ? 1 : 0)
      },
      get() {
        return Boolean(this.me.relevantallowed)
      }
    },
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
    checkSimplicity() {
      let ret = true
      let emailFrequency = null
      let communityEvents = null
      let volunteering = null

      // If we have the same settings on all groups, then we can show a simplified view.
      if (this.me && this.me.groups) {
        for (const group of this.me.groups) {
          if (group.type === 'Freegle') {
            const mysettings = group.mysettings

            if (mysettings) {
              if (emailFrequency === null) {
                emailFrequency = mysettings.emailfrequency
                communityEvents = mysettings.eventsallowed
                volunteering = mysettings.volunteeringallowed
              } else if (
                emailFrequency !== mysettings.emailfrequency ||
                communityEvents !== mysettings.eventsallowed ||
                volunteering !== mysettings.volunteeringallowed
              ) {
                ret = false
                break
              }
            }
          }
        }
      }

      return {
        ret: ret,
        emailFrequency: emailFrequency,
        communityEvents: communityEvents,
        volunteering: volunteering
      }
    },

    simpleSettings() {
      const simple = this.checkSimplicity
      return simple.ret
    },

    emailSimple: {
      get: function() {
        const simple = this.checkSimplicity
        return simple.emailFrequency
      },
      set: function(newValue) {
        this.changeAllGroups('emailfrequency', newValue)
      }
    },

    volunteeringSimple: {
      get: function() {
        const simple = this.checkSimplicity
        return Boolean(simple.volunteering)
      },
      set: function(newValue) {
        this.changeAllGroups('volunteeringallowed', newValue)
      }
    },

    eventSimple: {
      get: function() {
        const simple = this.checkSimplicity
        return Boolean(simple.communityEvents)
      },
      set: function(newValue) {
        this.changeAllGroups('eventsallowed', newValue)
      }
    }
  },

  async mounted() {
    try {
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme', 'phone', 'notifications'],
        force: true
      })

      this.me = this.$store.getters['auth/user']
      this.emailsOn = !Object.keys(this.me).includes('onholidaytill')
    } catch (e) {
      console.error('Failed to fetch user', e)
    }
  },

  methods: {
    async update() {
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme'],
        force: true
      })

      // TODO MINOR This use of getters is wrong; me should be a computed property.
      const me = this.$store.getters['auth/user']
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
    availability() {
      this.$refs.availabilitymodal.show()
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
        const data = await this.$store.dispatch('auth/saveEmail', {
          email: this.me.email
        })

        if (data && data.ret === 10) {
          // TODO MINOR Get rid of this magic number.
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
    },
    async savePhone() {
      this.savingPhone = true

      await this.$store.dispatch('auth/saveAndGet', {
        phone: this.me.phone
      })

      this.savingPhone = false
      this.savedPhone = true
      setTimeout(() => {
        this.savedPhone = false
      }, 2000)
    },
    async removePhone() {
      this.removingPhone = true

      setTimeout(() => {
        this.me.phone = null
      }, 1000)

      await this.$store.dispatch('auth/saveAndGet', {
        phone: ''
      })

      this.removingPhone = false
      this.removedPhone = true
      setTimeout(() => {
        this.removedPhone = false
      }, 2000)
    },
    toggleAdvanced(e) {
      e.preventDefault()
      this.showAdvanced = !this.showAdvanced
    },
    async changeAllGroups(param, value) {
      for (const group of this.me.groups) {
        if (group.type === 'Freegle') {
          const params = {
            userid: this.me.id,
            groupid: group.id
          }
          params[param] = value
          await this.$store.dispatch('auth/setGroup', params)
        }
      }

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme']
      })
    },
    async groupChange(e) {
      const params = {
        userid: this.me.id,
        groupid: e.groupid
      }
      params[e.param] = e.val
      await this.$store.dispatch('auth/setGroup', params)

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme']
      })
    },
    async changeNotification(e, type) {
      const settings = this.me.settings
      settings.notifications[type] = e.value
      this.me = await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    },
    async changeRelevant(e) {
      this.me = await this.$store.dispatch('auth/saveAndGet', {
        relevantallowed: e.value
      })
    },
    async changeHolidayDate(val) {
      this.me = await this.$store.dispatch('auth/saveAndGet', {
        onholidaytill: val
      })
    },
    async changeHolidayToggle(val) {
      if (val.value) {
        // Turned mails back on
        this.me = await this.$store.dispatch('auth/saveAndGet', {
          onholidaytill: null
        })
      }
    },
    async leaveGroup(id) {
      this.me = await this.$store.dispatch('auth/leaveGroup', {
        userid: this.me.id,
        groupid: id
      })
    },
    addressBook() {
      this.$refs.addressModal.show()
    }
  },
  head() {
    return this.buildHead(
      'Settings',
      'What people see about you, your email settings, all that good stuff...'
    )
  }
}
</script>
