<template>
  <div>
    <b-row>
      <b-col>
        <b-img-lazy
          v-if="users[userid].profile.turl"
          rounded="circle"
          thumbnail
          class="profile p-0 ml-1 mb-1 inline float-left mr-2"
          alt="Profile picture"
          title="Profile"
          :src="users[userid].profile.turl"
          @error.native="brokenImage"
        />
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
      <b-col cols="12" lg="8">
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
      <b-col cols="12" lg="4">
        <b-img
          v-if="newsfeed.volunteering.photo"
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
const VolunteerOpportunityModal = () => import('./VolunteerOpportunityModal')
const NewsLoveComment = () => import('~/components/NewsLoveComment')

export default {
  components: {
    VolunteerOpportunityModal,
    NewsLoveComment
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
