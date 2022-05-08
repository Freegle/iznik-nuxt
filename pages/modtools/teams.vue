<template>
  <div class="bg-white pl-2">
    <client-only>
      <h1>
        Teams
      </h1>
      <p>
        Freegle has a number of internal teams. Click to find out more about them, and who's on each one.
      </p>

      <div class="d-flex flex-wrap">
        <b-btn v-for="t in teams" :key="'team-' + t.name" variant="white" class="m-1" @click="selectTeam(t)">
          {{ t.name }}
        </b-btn>
      </div>

      <div v-if="selected && team && team.members" class="mt-2">
        <h2>{{ team.name }}</h2>
        <b-input-group
          v-if="supportOrAdmin"
          class="mt-2 mb-2"
        >
          <b-input v-model="memberToAdd" type="number" placeholder="Add member by ID" />
          <b-input-group-append>
            <SpinButton
              variant="primary"
              name="plus"
              label="Add"
              spinclass="text-white"
              :handler="addMember"
              :disabled="!memberToAdd"
            />
          </b-input-group-append>
        </b-input-group>
        <NoticeMessage v-if="!team.active" variant="info">
          This team is not active at the moment.
        </NoticeMessage>
        <p>{{ team.description }}</p>
        <p v-if="team.wikiurl">
          You can read more
          <!-- eslint-disable-next-line -->
          <ExternalLink :href="team.wikiurl">on the wiki</ExternalLink>.
        </p>
        <p v-if="team.email">
          <!-- eslint-disable-next-line -->
          Contact email: <ExternalLink :href="'mailto:' + team.email">{{ team.email }}</ExternalLink>
        </p>
        <ModTeamMember v-for="member in team.members" :key="'member-' + member.id" :teamid="team.id" :member="member" />
      </div>
    </client-only>
  </div>
</template>

<script>
import ModTeamMember from '../../components/ModTeamMember'
import NoticeMessage from '../../components/NoticeMessage'
import SpinButton from '../../components/SpinButton'
const ExternalLink = () => import('~/components/ExternalLink')

// TODO MT POSTLAUNCH Add/delete team members and teams.

export default {
  layout: 'modtools',
  components: {
    NoticeMessage,
    ModTeamMember,
    ExternalLink,
    SpinButton
  },
  data: function() {
    return {
      selected: null,
      memberToAdd: null
    }
  },
  computed: {
    teams() {
      return this.$store.getters['team/list']
    },
    team() {
      return this.$store.getters['team/get']
    }
  },
  mounted() {
    this.$store.dispatch('team/fetch')
  },
  methods: {
    async selectTeam(team) {
      await this.$store.dispatch('team/fetch', {
        id: team.id
      })

      this.selected = team.id
    },
    async addMember() {
      if (this.memberToAdd && this.selected) {
        await this.$store.dispatch('team/add', {
          id: this.selected,
          userid: this.memberToAdd
        })

        this.selected = null
      }
    }
  }
}
</script>
