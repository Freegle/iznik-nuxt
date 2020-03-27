<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap">
      <GroupSelect v-model="groupid" modonly />
      <b-btn variant="white">
        <v-icon name="plus" /> Add Group TODO
      </b-btn>
    </div>
    <div v-if="group" class="mt-2">
      <h3>Community Addresses</h3>
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
      <h3>Your Settings for this Community</h3>

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
      TODO
    </div>
  </div>
</template>
<script>
import GroupSelect from './GroupSelect'
import ModSettingShortlink from './ModSettingShortlink'
const OurToggle = () => import('@/components/OurToggle')

export default {
  components: { OurToggle, ModSettingShortlink, GroupSelect },
  data: function() {
    return {
      groupid: null
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
