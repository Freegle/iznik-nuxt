<template>
  <div>
    <AutocompleteLocal
      v-model="searchgroup"
      :items="groupitems"
      class="max"
      size="40"
      placeholder="Start typing a group name..."
    />
    <div v-if="group">
      <h3 class="mt-2">
        {{ group.nameshort }}
      </h3>
      <h4 v-if="canonGroupName(group.namedisplay) !== canonGroupName(group.nameshort)" class="text-muted">
        {{ group.namedisplay }}
      </h4>
      <div class="d-flex">
        <p>TODO MT Make toggles work from here?</p>
        <OurToggle
          :value="(Boolean)(group.publish)"
          :height="36"
          :width="150"
          :font-size="14"
          :labels="{unchecked: 'Not visible', checked: 'Visible on site'}"
          disabled
          class="mr-2"
        />
        <OurToggle
          :value="(Boolean)(group.ontn)"
          :height="36"
          :width="150"
          :font-size="14"
          :labels="{unchecked: 'Not on TN', checked: 'On TN'}"
          disabled
          class="mr-2"
        />
        <OurToggle
          :value="(Boolean)(group.onmap)"
          :height="36"
          :width="150"
          :font-size="14"
          :labels="{unchecked: 'No on map', checked: 'On map'}"
          disabled
          class="mr-2"
        />
      </div>
      <group-header :id="group.id" :key="'group-' + group.id" :group="group" :show-join="false" />

      <h4 class="mt-2">
        Group Info
      </h4>
      Group id <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ group.id }}.
      <br>
      <br>
      Explore page:
      <a target="_blank" rel="noopener noreferrer" :href="group.url">{{ group.url }}</a>
      <br>
      Volunteers email:
      <a :href="'mailto:' + group.modsemail">{{ group.modsemail }}</a>
      <br>
      Posting address:
      <a :href="'mailto:' + group.groupemail">{{ group.groupemail }}</a>
      <br>
      Twitter:
      <span v-if="group.twitter">
        <a :href="'https://twitter.com/' + group.twitter.name" target="_blank" rel="noopener noreferrer">{{ group.twitter.name }}</a>
        <span v-if="!group.twitter.valid" class="text-danger">
          Invalid
        </span>
        <span v-if="group.twitter.locked" class="text-danger">
          Locked
        </span>
      </span>
      <span v-else>
        None
      </span>
      <div v-if="!group.facebook || !group.facebook.length">
        Facebook: none
      </div>
      <div v-else>
        <div v-for="facebook in group.facebook" :key="'facebook-' + facebook.id">
          <div v-if="facebook.type === 'Page'">
            Facebook:
            <a :href="'https://facebook.com/' + facebook.name" target="_blank" rel="noopener noreferrer">{{ facebook.name }}</a>
            <span v-if="!facebook.valid" class="text-danger">
              Invalid
            </span>
          </div>
        </div>
      </div>
      <br>
      Affiliation last confirmed: {{ group.affiliationconfirmed | dateonly }} by
      <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ group.affiliationconfirmedby }}
      <br>
      <h4 class="mt-2">
        CGA
      </h4>
      <b-textarea v-model="group.cga" rows="4" class="mb-2" />
      <p>TODO MT Save updates to CGA and DPA</p>
      <b-btn variant="white" disabled>
        Save Update
      </b-btn>
      <h4 class="mt-2">
        DPA
      </h4>
      <b-textarea v-model="group.dpa" rows="4" class="mb-2" />
      <b-btn variant="white" disabled>
        Save Update
      </b-btn>
      <h4 class="mt-2">
        Volunteers
      </h4>
      <OurToggle
        :value="(Boolean)(!group.mentored)"
        :height="36"
        :width="170"
        :font-size="14"
        :labels="{checked: 'Local Volunteers', unchecked: 'Mentor Caretakers'}"
        readonly
        class="mr-2"
      />
      <b-img-lazy v-if="fetchingVolunteers" src="~/static/loader.gif" alt="Loading" class="d-block" />
      <ModSupportFindGroupVolunteer v-for="volunteer in sortedVolunteers" :key="'volunteer-' + volunteer.id" :volunteer="volunteer" :groupid="group.id " />
    </div>
  </div>
</template>
<script>
import ModSupportFindGroupVolunteer from './ModSupportFindGroupVolunteer'
import AutocompleteLocal from '@/components/AutocompleteLocal'
import GroupHeader from '@/components/GroupHeader'
const OurToggle = () => import('@/components/OurToggle')

export default {
  components: {
    ModSupportFindGroupVolunteer,
    OurToggle,
    AutocompleteLocal,
    GroupHeader
  },
  data: function() {
    return {
      searchgroup: null,
      fetchingVolunteers: false
    }
  },
  computed: {
    groups() {
      return Object.values(this.$store.getters['group/list'])
    },
    groupitems() {
      const ret = []

      if (this.groups) {
        this.groups.forEach(g => {
          if (
            this.canonGroupName(g.nameshort) !==
            this.canonGroupName(g.namedisplay)
          ) {
            ret.push(g.nameshort + ' / ' + g.namedisplay)
          } else {
            ret.push(g.nameshort)
          }
        })
      }

      return ret
    },
    groupid() {
      let ret = null

      if (this.searchgroup) {
        ret = this.groups.find(g => {
          let name = g.nameshort

          if (
            this.canonGroupName(g.nameshort) !==
            this.canonGroupName(g.namedisplay)
          ) {
            name = g.nameshort + ' / ' + g.namedisplay
          }

          if (name === this.searchgroup) {
            return true
          } else {
            return false
          }
        })

        ret = ret ? ret.id : null
      }

      return ret
    },
    group() {
      return this.$store.getters['group/get'](this.groupid)
    },
    volunteers() {
      return this.$store.getters['members/getByGroup'](this.groupid)
    },
    sortedVolunteers() {
      const r = this.volunteers
      r.sort((a, b) => {
        if (a.lastmoderated && !b.lastmoderated) {
          return -1
        } else if (b.lastmoderated && !a.lastmoderated) {
          return 1
        } else
          return (
            new Date(b.lastmoderated).getTime() -
            new Date(a.lastmoderated).getTime()
          )
      })

      return r
    }
  },
  watch: {
    async groupid(id) {
      // Get the full group info
      await this.$store.dispatch('group/fetch', {
        id: id,
        polygon: true
      })

      // And the list of volunteers
      this.fetchingVolunteers = true
      this.$store.dispatch('members/clear')

      this.$store.dispatch('members/fetchMembers', {
        groupid: this.groupid,
        collection: 'Approved',
        modtools: true,
        summary: false,
        limit: 1000,
        filter: 2
      })

      this.fetchingVolunteers = false
    }
  },
  async mounted() {
    // Grab the list of groups
    await this.$store.dispatch('group/list', {
      grouptype: 'Freegle'
    })
  },
  methods: {
    canonGroupName(name) {
      return name ? name.toLowerCase().replace(/-|_| /g, '') : null
    }
  }
}
</script>
<style scoped>
.max {
  max-width: 300px;
}
</style>
