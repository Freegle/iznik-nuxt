<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <h1>Shortlinks</h1>
          <h5>
            Shortlinks let people find Freegle communities quickly. On this page you can see all the shortlinks we have, and view statistics about them.
          </h5>
          <b-card no-body>
            <b-card-body>
              <p>
                You can also create your own shortlinks. This is particularly useful if you want to promote a
                community in a particular way, and then see how effective that promotion was. Keep them
                short (less typing) and memorable (less forgetting).
              </p>
              <div class="d-flex justify-content-between">
                <GroupSelect v-model="groupid" />
                <b-form-input v-model="name" placeholder="Enter your shortlink name" maxlength="30" />
                <b-btn variant="white" @click="create">
                  <v-icon v-if="created" name="check" class="text-success" />
                  <v-icon v-else-if="saving" name="sync" class="fa-spin" />
                  <v-icon v-else name="save" />
                  Create shortlink
                </b-btn>
              </div>
            </b-card-body>
          </b-card>
        </div>
        <b-row class="mt-2 bg-white m-0">
          <b-col cols="3">
            <b>Community</b>
          </b-col>
          <b-col cols="7">
            <b>Shortlink</b>
          </b-col>
          <b-col cols="2" />
        </b-row>
        <div v-for="shortlink in sortedLinks" :key="'shortlink-' + shortlink.id" class="bg-white m-0">
          <div v-if="shortlink.type === 'Group'">
            <b-row class="m-0">
              <b-col cols="3">
                <a :href="shortlink.url" target="_blank">
                  {{ shortlink.nameshort }}
                </a>
              </b-col>
              <b-col cols="7">
                <a :href="'https://freegle.in/' + shortlink.name">
                  {{ 'https://freegle.in/' + shortlink.name }}
                </a>
              </b-col>
              <b-col cols="2">
                <b-btn variant="white" class="mb-1" :to="'/shortlinks/' + shortlink.id">
                  View Stats
                </b-btn>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
import GroupSelect from '../../components/GroupSelect'
import loginOptional from '@/mixins/loginOptional.js'

export default {
  components: { GroupSelect },
  mixins: [loginOptional],
  data: function() {
    return {
      groupid: null,
      name: null,
      saving: false
    }
  },
  computed: {
    shortlinks() {
      const ret = this.$store.getters['shortlinks/list']
      return ret
    },
    sortedLinks() {
      if (this.shortlinks) {
        const freeglegroups = Object.values(this.shortlinks)
          .concat()
          .filter(item => {
            return item.type === 'Group'
          })
        const sorted = freeglegroups.sort((a, b) => {
          if (a.type === 'Group' && b.type === 'Group') {
            return a.nameshort
              .toLowerCase()
              .localeCompare(b.nameshort.toLowerCase())
          }

          return 0
        })

        return sorted
      }

      return null
    }
  },
  async mounted() {
    await this.$store.dispatch('shortlinks/fetch')
  },
  methods: {
    async create() {
      console.log('Create', this.groupid, this.name)
      if (this.groupid && this.name) {
        this.saving = true
        const id = await this.$store.dispatch('shortlinks/add', {
          groupid: this.groupid,
          name: this.name
        })
        await this.$store.dispatch('shortlinks/fetch', {
          id: id
        })

        this.saving = false
        this.created = true

        setTimeout(() => {
          this.created = false
        }, 10000)
      }
    }
  }
}
</script>
