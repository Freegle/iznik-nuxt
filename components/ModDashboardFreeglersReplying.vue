<template>
  <div>
    <b-img v-if="loading" src="~/static/loader.gif" alt="Loading" />
    <div v-else-if="UsersReplying && UsersReplying.length">
      <b-card no-body>
        <b-card-body>
          <b-row v-for="user in UsersReplying" :key="'popular-' + user.id">
            <b-col cols="2" class="text-nowrap">
              <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ user.id }}
            </b-col>
            <b-col cols="6" class="text-success font-weight-bold">
              <ProfileImage :image="user.profile.turl" is-thumbnail size="sm" />
              {{ user.displayname }}
            </b-col>
            <b-col cols="2">
              {{ user.replies | pluralize(['reply', 'replies'], { includeNumber: true }) }}
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
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
      askfor: ['UsersReplying'],
      UsersReplying: null
    }
  }
}
</script>
