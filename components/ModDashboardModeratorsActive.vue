<template>
  <div>
    <h2>Active Volunteers</h2>
    <div v-if="groupid">
      <b-card v-if="loading" no-body>
        <b-card-body>
          <b-row><b-col>&nbsp;</b-col></b-row>
          <b-row>
            <b-col class="text-faded pulsate text-center">
              Loading...
            </b-col>
          </b-row>
          <b-row><b-col>&nbsp;</b-col></b-row>
        </b-card-body>
      </b-card>
      <div v-else-if="ModeratorsActive && ModeratorsActive.length">
        <b-card no-body>
          <b-card-body>
            <b-row v-for="user in ModeratorsActive" :key="'popular-' + user.id">
              <b-col cols="2" class="text-nowrap">
                <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ user.id }}
              </b-col>
              <b-col cols="6" class="text-success font-weight-bold">
                <ProfileImage :image="user.profile.turl" is-thumbnail size="sm" :is-moderator="user.systemrole === 'Moderator' || user.systemrole === 'Support' || user.systemrole === 'Admin'" />
                {{ user.displayname }}
              </b-col>
              <b-col cols="2">
                {{ user.lastactive | timeago }}
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </div>
    </div>
    <div v-else>
      <p>Select a community and click <em>Update</em> to show the active volunteers for that community.</p>
    </div>
  </div>
</template>
<script>
import ProfileImage from './ProfileImage'
import ModDashboardBase from '@/components/ModDashboardBase'

export default {
  components: { ProfileImage },
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: ['ModeratorsActive'],
      ModeratorsActive: null
    }
  }
}
</script>
