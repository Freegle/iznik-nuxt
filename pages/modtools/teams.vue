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

      <div v-if="team && team.members" class="mt-2">
        <h2>{{ team.name }}</h2>
        <NoticeMessage v-if="!team.active" variant="info">
          This team is not active at the moment.
        </NoticeMessage>
        <p>{{ team.description }}</p>
        <p v-if="team.email">
          <!-- eslint-disable-next-line -->
          Contact email: <ExternalLink :href="'mailto:' + team.email">{{ team.email }}</ExternalLink>
        </p>
        <ModTeamMember v-for="member in team.members" :key="'member-' + member.id" :member="member" />
      </div>
    </client-only>
  </div>
</template>

<script>
import ModTeamMember from '../../components/ModTeamMember'
import NoticeMessage from '../../components/NoticeMessage'
const ExternalLink = () => import('~/components/ExternalLink')

// TODO MT POSTLAUNCH Add/delete team members and teams.

export default {
  layout: 'modtools',
  components: {
    NoticeMessage,
    ModTeamMember,
    ExternalLink
  },
  data: function() {
    return {
      selected: null
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
      console.log('Select team', team)
      await this.$store.dispatch('team/fetch', {
        id: team.id
      })
      console.log('Fetched team')

      this.selected = team.id
    }
  }
}
</script>
