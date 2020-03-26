<template>
  <div v-if="me && me.settings && me.settings.notifications">
    <client-only>
      <b-row class="m-0">
        <b-col cols="0" xl="3" />
        <b-col cols="12" xl="6" class="p-0">
          <NoticeMessage variant="info" class="mt-2">
            <div v-if="simple">
              <p>
                You are viewing the simple version of the site, so you won't see community features like ChitChat,
                community events or volunteer opportunities.  Some advanced settings won't show in this page.
              </p>
            </div>
            <div v-else>
              <p>
                You are viewing the full version of the site.  If you find this is too "busy", you can choose to view
                a simplified version.
              </p>
            </div>
            <p>
              You can toggle which version you see by clicking here:
            </p>
            <SimpleView />
          </NoticeMessage>
          <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
            <template v-slot:header>
              <v-icon name="globe-europe" /> Your Public Profile
            </template>
            <b-card-body class="p-0 pt-1">
              <p class="text-muted">
                This is what other freeglers can see about you.
              </p>
              <b-row>
                <b-col cols="12">
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
                <b-col cols="12" xl="6">
                  <b-card>
                    <b-card-body class="text-center p-2">
                      <ProfileImage
                        v-if="me.profile.url"
                        :image="profileurl"
                        class="mr-1 mb-1 mt-1 inline"
                        is-thumbnail
                        size="xl"
                      />
                      <br>
                      <OurToggle
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
                      <b-btn variant="primary" class="mt-2" @click="uploadProfile">
                        <v-icon name="camera" /> Upload photo
                      </b-btn>
                      <b-row v-if="uploading" class="bg-white">
                        <b-col class="p-0">
                          <OurFilePond
                            imgtype="User"
                            imgflag="user"
                            :msgid="me.id"
                            @photoProcessed="photoProcessed"
                          />
                        </b-col>
                      </b-row>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" xl="6">
                  <b-card no-body>
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
              <b-row>
                <b-col>
                  <b-btn variant="success" class="mt-2" @click="viewProfile">
                    <v-icon name="eye" /> View Your Profile
                  </b-btn>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
          <b-card v-if="!simple" border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
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
                      <b-input v-model="me.email" placeholder="Your email" label="Your email address" type="email" />
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
                  <NoticeMessage v-if="me.bouncing" variant="danger" class="mb-2">
                    <p>We can't send to your email address.  Please change it to a valid one and press <em>Save</em>.</p>
                    <p>Or if you're sure it's valid:</p>
                    <b-button variant="white" @click="unbounce">
                      <v-icon v-if="unbouncing" name="sync" class="text-success fa-spin" />
                      <v-icon v-else-if="unbounced" name="check" class="text-success" />
                      <v-icon v-else name="check" />
                      Try again
                    </b-button>
                  </NoticeMessage>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12" sm="6">
                  <b-form-group
                    label="Your password:"
                  >
                    <b-input-group id="input-password">
                      <b-input v-model="me.password" :type="showPassword ? 'text' : 'password'" placeholder="Your password" label="Your password" />
                      <b-input-group-append>
                        <!-- TODO RAHUL DESIGN MINOR The shadow on the input field that you get when you're focused ought really to include this append.-->
                        <b-button variant="white" class="transbord" title="Show password" @click="togglePassword">
                          <v-icon v-if="showPassword" title="Hide password" class="text-secondary" flip="horizontal">
                            <v-icon name="eye" />
                            <v-icon name="slash" />
                          </v-icon>
                          <v-icon v-else name="eye" class="text-secondary" />
                        </b-button>
                      </b-input-group-append>
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
            <div v-if="me.groups && me.groups.length">
              <p>You can pause regular emails for a while, for example if you're on holiday.</p>
              <OurToggle
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
                  <div v-if="me.groups">
                    <div v-for="group in me.groups" :key="'settingsgroup-' + group.id" class="list-unstyled">
                      <b-card v-if="group.type === 'Freegle'" class="nocardbot">
                        <b-card-title>
                          <nuxt-link :to="'/communities/' + group.id">
                            <b-img-lazy rounded thumbnail alt="Community profile picture" :src="group.profile" class="float-right groupprofile" />
                          </nuxt-link>
                          <nuxt-link :to="'/communities/' + group.id">
                            {{ group.namedisplay }}
                          </nuxt-link>
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
          <b-card v-if="!simple" border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
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
                Email doesn't always get through, so check your spam folders, and check <em><nuxt-link to="/chats">Chats</nuxt-link></em> on here occasionally.
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
                  <b-alert v-if="me.phone" show variant="info">
                    <p>
                      It costs Freegle to send these - if you can, please:
                    </p>
                    <donation-button />
                  </b-alert>
                </b-col>
              </b-row>
              <h5>Email Alerts</h5>
              <p>
                Mail me chat messages from other freeglers I'm talking to about OFFERs and WANTEDs.
              </p>
              <OurToggle
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
              <OurToggle
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
                We can email you if there's an unread notification on here, or about recent ChitChat posts from nearby
                freeglers.
              </p>
              <OurToggle
                v-model="notificationmails"
                :height="30"
                :width="150"
                :font-size="14"
                :sync="true"
                :labels="{checked: 'Send Them', unchecked: 'No Thanks'}"
                color="#61AE24"
                @change="changeNotifChitchat"
              />
              <p>
                We can email you about OFFERs/WANTEDs you might be interested in.
              </p>
              <OurToggle
                v-model="relevantallowed"
                :height="30"
                :width="150"
                :font-size="14"
                :sync="true"
                :labels="{checked: 'Send Them', unchecked: 'No Thanks'}"
                color="#61AE24"
                @change="changeRelevant"
              />
              <p>
                We send occasional newsletters or collections of nice stories from other freeglers..
              </p>
              <OurToggle
                v-model="newslettersallowed"
                :height="30"
                :width="150"
                :font-size="14"
                :sync="true"
                :labels="{checked: 'Send Them', unchecked: 'No Thanks'}"
                color="#61AE24"
                @change="changeNewsletter"
              />
              <h5>Other Alerts</h5>
              <p>
                Apps for your
                <a href="https://play.google.com/store/apps/details?id=org.ilovefreegle.direct" target="_blank">Android</a> or
                <a href="https://itunes.apple.com/gb/app/freegle/id970045029?ls=1&mt=8" target="_blank">IOS</a> phone/tablet.
              </p>
              <OurToggle
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
              <OurToggle
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
              <OurToggle
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
        <b-col cols="0" xl="3" />
      </b-row>
      <AboutMeModal ref="aboutmemodal" @change="update" />
      <ProfileModal :id="me ? me.id : null" ref="profilemodal" />
      <EmailConfirmModal ref="emailconfirm" />
      <AvailabilityModal ref="availabilitymodal" :thisuid="me.id" />
      <AddressModal ref="addressModal" />
    </client-only>
  </div>
</template>

<script>
import Vue from 'vue'
import SimpleView from '../../components/SimpleView'
import WaitForRef from '@/mixins/waitForRef'
import loginRequired from '@/mixins/loginRequired.js'
import EmailConfirmModal from '~/components/EmailConfirmModal'
import buildHead from '@/mixins/buildHead'
import ProfileImage from '~/components/ProfileImage'
import 'vue2-datepicker/index.css'

const AboutMeModal = () => import('~/components/AboutMeModal')
const AvailabilityModal = () => import('~/components/AvailabilityModal')
const AddressModal = () => import('~/components/AddressModal')
const ProfileModal = () => import('~/components/ProfileModal')
const Postcode = () => import('~/components/Postcode')
const SettingsGroup = () => import('~/components/SettingsGroup')
const NoticeMessage = () => import('~/components/NoticeMessage')
const OurFilePond = () => import('~/components/OurFilePond')
const OurToggle = () => import('~/components/OurToggle')
const DatePicker = () => import('vue2-datepicker')
const DonationButton = () => import('~/components/DonationButton')

export default {
  components: {
    SimpleView,
    OurToggle,
    DatePicker,
    EmailConfirmModal,
    AboutMeModal,
    AvailabilityModal,
    AddressModal,
    ProfileModal,
    Postcode,
    SettingsGroup,
    NoticeMessage,
    ProfileImage,
    OurFilePond,
    DonationButton
  },
  mixins: [loginRequired, buildHead, WaitForRef],
  data: function() {
    return {
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
      removedPhone: false,
      unbouncing: false,
      unbounced: false,
      uploading: false,
      showPassword: false
    }
  },
  computed: {
    relevantallowed: {
      // This is 1/0 in the model whereas we want Boolean.
      set(val) {
        Vue.set(this.me, 'relevantallowed', val ? 1 : 0)
      },
      get() {
        return Boolean(this.me.relevantallowed)
      }
    },
    notificationmails: {
      // This is 1/0 in the model whereas we want Boolean.
      set(val) {
        Vue.set(this.me, 'notificationmails', val ? 1 : 0)
      },
      get() {
        return Boolean(this.me.settings.notificationmails)
      }
    },
    newslettersallowed: {
      // This is 1/0 in the model whereas we want Boolean.
      set(val) {
        Vue.set(this.me, 'newslettersallowed', val ? 1 : 0)
      },
      get() {
        return Boolean(this.me.newslettersallowed)
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

      if (this.me) {
        this.emailsOn = !Object.keys(this.me).includes('onholidaytill')
      }
    } catch (e) {
      console.error('Failed to fetch user', e)
    }
  },

  methods: {
    async update() {
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme', 'notifications'],
        force: true
      })
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
      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    },
    async saveName() {
      await this.$store.dispatch('auth/saveAndGet', {
        displayname: this.me.displayname
      })
    },
    selectPostcode(pc) {
      this.pc = pc
    },
    async savePassword() {
      this.savingPassword = true

      if (this.me.password) {
        await this.$store.dispatch('auth/saveAndGet', {
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
          this.waitForRef('emailconfirm', () => {
            this.$refs.emailconfirm.show()
          })
        }
      }

      this.savingEmail = false
      this.savedEmail = true
      setTimeout(() => {
        this.savedEmail = false
      }, 2000)
    },
    async unbounce() {
      this.unbouncing = true

      if (this.me.email && this.me.bouncing) {
        await this.$store.dispatch('auth/unbounce', {
          id: this.me.id
        })
      }

      this.unbouncing = false
      this.unbounced = true
      setTimeout(() => {
        this.unbounced = false
      }, 2000)
    },
    async savePostcode() {
      const settings = this.me.settings
      this.savingPostcode = true

      if (!settings.mylocation || settings.mylocation.id !== this.pc.id) {
        settings.mylocation = this.pc
        await this.$store.dispatch('auth/saveAndGet', {
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
        components: ['me', 'groups', 'aboutme', 'notifications']
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
        components: ['me', 'groups', 'aboutme', 'notifications']
      })
    },
    async changeNotification(e, type) {
      const settings = this.me.settings
      settings.notifications[type] = e.value
      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    },
    async changeRelevant(e) {
      await this.$store.dispatch('auth/saveAndGet', {
        relevantallowed: e.value
      })
    },
    async changeNotifChitchat(e) {
      const settings = this.me.settings
      settings.notificationmails = e.value
      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    },
    async changeNewsletter(e) {
      await this.$store.dispatch('auth/saveAndGet', {
        newslettersallowed: e.value
      })
    },
    async changeHolidayDate(val) {
      await this.$store.dispatch('auth/saveAndGet', {
        onholidaytill: val
      })
    },
    async changeHolidayToggle(val) {
      if (val.value) {
        // Turned mails back on
        await this.$store.dispatch('auth/saveAndGet', {
          onholidaytill: null
        })
      }
    },
    async leaveGroup(id) {
      await this.$store.dispatch('auth/leaveGroup', {
        userid: this.me.id,
        groupid: id
      })
    },
    addressBook() {
      this.$refs.addressModal.show()
    },
    photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.$router.go()
    },
    uploadProfile() {
      this.uploading = true
    },
    togglePassword() {
      this.showPassword = !this.showPassword
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

<style scoped lang="scss">
@import 'color-vars';

.groupprofile {
  height: 100px !important;
}

.nocardbot .card-body {
  padding-bottom: 0px;
}

h4 a {
  color: $colour-header;
}
</style>
