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
          <b-card v-if="groupOptions.length" no-body>
            <b-card-body>
              <p>
                You can also create your own shortlinks. This is particularly useful if you want to promote a
                community in a particular way, and then see how effective that promotion was. Keep them
                short (less typing) and memorable (less forgetting).
              </p>
              <NoticeMessage v-if="error" variant="danger" class="mb-2">
                {{ error }}
              </NoticeMessage>
              <div class="d-flex justify-content-between flex-wrap">
                <b-select v-model="groupid" :options="groupOptions" class="select" />
                <div class="d-flex">
                  <b class="mt-2">freegle.in/</b>
                  <b-form-input v-model="name" placeholder="Enter your shortlink name" maxlength="30" />
                </div>
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
        <Shortlinks :shortlinks="sortedLinks" />
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
import loginRequired from '../../mixins/loginRequired'
import Shortlinks from '../../components/Shortlinks'
import NoticeMessage from '../../components/NoticeMessage'

export default {
  components: { NoticeMessage, Shortlinks },
  mixins: [loginRequired],
  data: function() {
    return {
      groupid: -1,
      name: null,
      saving: false,
      created: false,
      groups: [],
      error: null
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
    },
    groupOptions() {
      const options = []

      options.push({
        value: -1,
        html: '<em>-- Please choose --</em>'
      })

      for (const group in this.groups) {
        options.push({
          value: this.groups[group].id,
          text: this.groups[group].namedisplay
        })
      }

      options.sort((a, b) => {
        if (a.value === -1) {
          return -1
        } else if (b.value === -1) {
          return 1
        } else {
          return a.text.toLowerCase().localeCompare(b.text.toLowerCase())
        }
      })

      return options
    }
  },
  async mounted() {
    await this.$store.dispatch('shortlinks/fetch')
    await this.$store.dispatch('group/list', {
      grouptype: 'Freegle'
    })
    this.groups = this.$store.getters['group/list']
  },
  methods: {
    async create() {
      if (this.groupid && this.name) {
        this.saving = true

        try {
          const id = await this.$store.dispatch('shortlinks/add', {
            groupid: this.groupid,
            name: this.name
          })

          await this.$store.dispatch('shortlinks/fetch', {
            id: id
          })
        } catch (e) {
          if (e.response && e.response.data) {
            // Duplicate
            this.error = e.response.data.status
          }

          console.log('Failed', e.response)
        }

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
<style scoped>
.select {
  max-width: 300px;
}
</style>
