<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <GroupSelect v-model="groupid" modonly />
      <b-btn variant="white">
        <v-icon name="plus" /> Add Group TODO
      </b-btn>
    </div>
    <div v-if="group && group.mysettings" class="mt-2">
      <b-card no-body class="mb-2">
        <b-card-header>
          Community Addresses
        </b-card-header>
        <b-card-body>
          <p>Here's how your members can reach you by email:</p>
          <p>
            <a :href="'mailto:' + group.modsemail">{{ group.modsemail }}</a>
          </p>
          <p>Members can post by email.  Please only use this for members who really need it:</p>
          <p>
            <a :href="'mailto:' + group.groupemail">{{ group.groupemail }}</a>
          </p>
          <p v-if="!Object.values(shortlinks).length">
            Your community has no shortlinks at the moment.
          </p>
          <div v-else class="mb-2">
            <p>Your community has the following shortlinks:</p>
            <ModSettingShortlink v-for="shortlink in shortlinks" :key="'shortlink-' + shortlink.id" :shortlink="shortlink" />
          </div>
          <p>
            You can add more shortlinks
            <!-- eslint-disable-next-line -->
            <a href="/shortlinks" target="_blank">here</a>.
          </p>
        </b-card-body>
      </b-card>
      <b-card no-body class="mb-2">
        <b-card-header>
          Your Settings
        </b-card-header>
        <b-card-body>
          <p>
            These settings affect how this community behaves for you. If you change them, it'll only affect you.
          </p>
          <b-form-group label="Are you actively moderating this community?">
            <b-form-text class="mb-2">
              We notify you about work to do for active communities.
            </b-form-text>
            <OurToggle
              v-model="active"
              class="mt-2"
              :height="30"
              :width="150"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Active', unchecked: 'Backup'}"
              color="#61AE24"
            />
          </b-form-group>
          <b-form-group label="ModConfig to use for this community:">
            <b-form-text class="mb-2">
              The ModConfig you use controls behaviour such as which standard message buttons you can use.
              You can see ModConfig settings on the separate tab.
            </b-form-text>
            <b-select v-model="modconfig" :options="modConfigOptions" class="mb-2 font-weight-bold" />
          </b-form-group>
        </b-card-body>
      </b-card>

      <b-card no-body class="mb-2">
        <b-card-header>
          Appearance
        </b-card-header>
        <b-card-body>
          <h4 />
          <b-form-group label="Profile picture">
            <b-form-text class="mb-2">
              This is used in emails and on the site. It needs to look good small, like a Facebook profile picture.
              Avoid text - it's not readable.  Aim for a simple image that people will recognise as relating to your
              location.
            </b-form-text>
            <GroupProfileImage
              :image="group.profile ? group.profile : '/placeholder.png'"
              :alt-text="'Profile picture for ' + group.namedisplay"
            />
            <b-btn variant="primary" class="mt-2 d-block" @click="uploadProfile">
              <v-icon name="camera" /> Upload photo
            </b-btn>
            <OurFilePond
              v-if="uploadingProfile"
              imgtype="Group"
              imgflag="group"
              :groupid="groupid"
              @photoProcessed="profileUploaded"
            />
          </b-form-group>
          <ModGroupSetting
            :groupid="groupid"
            name="tagline"
            label="Tagline"
            description="This should be short and snappy. Include some local reference that people in your area will feel connected to."
          />
          <!--          TODO Worry words in group description-->
          <ModGroupSetting
            :groupid="groupid"
            name="welcomemail"
            label="Welcome email"
            description="This is emailed out to new members.  Keep it short.  Positive - use 'do' not 'don't'."
            type="textarea"
            :rows="10"
          />
          <b-form-group label="Description">
            <b-form-text class="mb-2">
              This is a longer description which will display on the community page and elsewhere on the site.
              HTML is OK in here, and if you're really geeky, Bootstrap-4 styling.
            </b-form-text>
            <div v-if="!editingDescription">
              <!-- eslint-disable-next-line -->
              <div v-html="group.description" class="border border-info rounded p-2 mb-2" />
              <b-btn variant="white" @click="editingDescription = true">
                <v-icon name="pen" /> Edit
              </b-btn>
            </div>
            <div v-else>
              <VueEditor v-model="group.description" />
              <SpinButton variant="white" name="save" label="Save" :handler="saveDescription" class="mt-2" />
            </div>
          </b-form-group>
        </b-card-body>
      </b-card>
      TODO Mapping
    </div>
  </div>
</template>
<script>
import GroupSelect from './GroupSelect'
import ModSettingShortlink from './ModSettingShortlink'
import GroupProfileImage from './GroupProfileImage'
import OurFilePond from './OurFilePond'
import ModGroupSetting from './ModGroupSetting'
import SpinButton from './SpinButton'
const OurToggle = () => import('@/components/OurToggle')

let VueEditor

if (process.client) {
  VueEditor = require('vue2-editor').VueEditor
}

export default {
  components: {
    SpinButton,
    ModGroupSetting,
    OurFilePond,
    GroupProfileImage,
    OurToggle,
    ModSettingShortlink,
    GroupSelect,
    VueEditor
  },
  data: function() {
    return {
      groupid: null,
      uploadingProfile: false,
      editingDescription: false
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.groupid)
    },
    shortlinks() {
      return this.$store.getters['shortlinks/list']
    },
    active: {
      get() {
        return Boolean(this.group.mysettings.active)
      },
      set(newval) {
        this.saveMembershipSetting('active', newval ? 1 : 0)
      }
    },
    modconfig: {
      get() {
        return parseInt(this.group.mysettings.configid)
      },
      set(newval) {
        this.saveMembershipSetting('configid', newval)
      }
    },
    tagline: {
      get() {
        return this.group.tagline
      },
      set() {}
    },
    modConfigs() {
      return this.$store.getters['modconfigs/configs']
    },
    modConfigOptions() {
      const ret = []
      this.modConfigs.forEach(c => {
        ret.push({
          value: c.id,
          text: c.name
        })
      })

      return ret
    }
  },
  watch: {
    groupid() {
      this.fetchGroup()
    }
  },
  mounted() {
    this.fetchConfigs()
  },
  methods: {
    async fetchGroup() {
      this.editingDescription = false

      await this.$store.dispatch('group/fetch', {
        id: this.groupid,
        polygon: true
      })

      this.$store.dispatch('shortlinks/fetch', {
        groupid: this.groupid
      })
    },
    async fetchConfigs() {
      await this.$api.session.fetch({
        components: ['configs'],
        modtools: true
      })
    },
    async saveMembershipSetting(name, val) {
      const settings = this.group.mysettings
      settings[name] = val

      await this.$store.dispatch('auth/setGroup', {
        groupid: this.groupid,
        userid: this.myid,
        settings
      })

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups'],
        force: true
      })
    },
    uploadProfile() {
      this.uploadingProfile = true
    },
    profileUploaded(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploadingProfile = false

      // Set the image id in the group.
      this.$store.dispatch('group/update', {
        id: this.groupid,
        profile: imageid
      })
    },
    saveGroupSetting(name, val) {
      // Note that we get a sneaky progress indicator and success from SpinButton even though actually we're doing the
      // work here triggered by the set on the computed value.
      const data = {
        id: this.groupid
      }

      data[name] = val

      this.$store.dispatch('group/update', data)
    },
    async saveDescription() {
      await this.$store.dispatch('group/update', {
        id: this.groupid,
        description: this.group.description
      })

      this.editingDescription = false
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
