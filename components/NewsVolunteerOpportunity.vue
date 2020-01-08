<template>
  <div>
    <b-row>
      <b-col>
        <profile-image v-if="users[userid].profile.turl" :image="users[userid].profile.turl" class="ml-1 mr-2 mb-1 inline" is-thumbnail size="lg" />
        <v-icon v-if="users[userid].settings.showmod" name="leaf" class="showmod text-success" />
        <span class="text-success font-weight-bold">{{ users[userid].displayname }}</span>
        posted a volunteering opportunity: <b>{{ newsfeed.volunteering.title }}</b>
        <br>
        <span class="text-muted small">
          {{ $dayjs(newsfeed.timestamp).fromNow() }}
        </span>
        on {{ newsfeed.volunteering.groups[0].namedisplay }}
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" :lg="newsfeed.volunteering.photo ? 8 : 12">
        <span v-if="newsfeed.volunteering.description" class="text-truncate d-block">
          <v-icon name="info-circle" class="fa-fw" /> {{ newsfeed.volunteering.description }}
        </span>
        <span v-if="newsfeed.volunteering.location" class="text-truncate d-block">
          <v-icon name="map-marker-alt" class="fa-fw" /> {{ newsfeed.volunteering.location }}
        </span>
        <br>
        <b-btn variant="primary" class="mt-2" @click="moreInfo">
          <v-icon name="info-circle" /> More info
        </b-btn>
      </b-col>
      <b-col v-if="newsfeed.volunteering.photo" cols="12" lg="4">
        <b-img
          thumbnail
          rounded
          lazy
          :src="newsfeed.volunteering.photo.paththumb"
          class="clickme d-inline-block mt-2 mt-md-0 float-md-right"
          @click="moreInfo"
        />
      </b-col>
    </b-row>
    <hr>
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <span class="float-right d-inline-block">
          <b-btn variant="white" size="sm" @click="addOpportunity">
            <v-icon name="plus" /> Add your opportunity
          </b-btn>
        </span>
      </b-col>
    </b-row>
    <VolunteerOpportunityModal ref="addOpportunity" :start-edit="true" />
    <VolunteerOpportunityModal ref="moreInfo" :volunteering="newsfeed.volunteering" />
  </div>
</template>
<style scoped>
</style>
<script>
import NewsBase from '~/components/NewsBase'
import NewsLoveComment from '~/components/NewsLoveComment'
const VolunteerOpportunityModal = () => import('./VolunteerOpportunityModal')
const ProfileImage = () => import('~/components/ProfileImage')

export default {
  components: {
    VolunteerOpportunityModal,
    NewsLoveComment,
    ProfileImage
  },
  extends: NewsBase,
  methods: {
    moreInfo() {
      this.$refs.moreInfo.show()
    },
    addOpportunity() {
      this.$refs.addOpportunity.show()
    }
  }
}
</script>
