<template>
  <div v-if="me">
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6" class="p-0">
        <b-card border-variant="info" header-bg-variant="info" header-text-variant="white" class="mt-2">
          <template v-slot:header>
            <v-icon name="info-circle" /> Your Public Profile
          </template>
          <b-card-body class="p-0 pt-1">
            <p class="text-muted">
              <v-icon name="globe-europe" /> This is what other freeglers can see about you.
              <b-btn variant="success" class="float-right" @click="viewProfile">
                View Your Profile
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
                      :src="me.profile.url"
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
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
    <AboutMeModal ref="aboutmemodal" @change="update" />
    <ProfileModal :id="me ? me.id : null" ref="profilemodal" />
  </div>
</template>
<style scoped>
.profile {
  width: 100px !important;
  height: 100px !important;
}
</style>
<script>
import loginRequired from '@/mixins/loginRequired.js'
const AboutMeModal = () => import('~/components/AboutMeModal')
const ProfileModal = () => import('~/components/ProfileModal')
// const GroupSelect = () => import('~/components/GroupSelect.vue')

export default {
  components: {
    // GroupSelect,
    AboutMeModal,
    ProfileModal
  },
  mixins: [loginRequired],
  data: function() {
    return {
      me: null
    }
  },
  computed: {
    aboutme() {
      const ret = this.me && this.me.aboutme ? this.me.aboutme.text : ''
      return ret
    },
    useprofile() {
      let ret = true

      if (this.me && this.me.settings) {
        if (Object.keys(this.me.settings).includes('useprofile')) {
          ret = this.me.settings.useprofile
        }
      }

      return ret
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
    }
  }
}
</script>
