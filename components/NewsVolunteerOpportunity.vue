<template>
  <div>
    <div class="d-flex">
      <ProfileImage
        v-if="users[userid].profile.turl"
        :image="users[userid].profile.turl"
        class="ml-1 mr-2 mb-1 inline"
        is-thumbnail
        :is-moderator="(Boolean)(users[userid].settings.showmod)"
        size="lg"
      />
      <div>
        <span class="text-success font-weight-bold">{{ users[userid].displayname }}</span>
        posted a volunteering opportunity<span class="d-none d-md-inline-block">:</span><br class="d-block d-md-none"> <b>{{ newsfeed.volunteering.title }}</b>
        <br>
        <span class="text-muted small">
          {{ newsfeed.added | timeago }}
        </span>
        <span v-if="newsfeed.volunteering.groups && newsfeed.volunteering.groups.length">
          on {{ newsfeed.volunteering.groups[0].namedisplay }}
        </span>
      </div>
    </div>
    <div class="volunteering__container">
      <div class="volunteering__description">
        <div v-if="newsfeed.volunteering.description" class="text-truncate">
          <v-icon name="info-circle" class="fa-fw" />
          {{ newsfeed.volunteering.description }}
        </div>
        <div v-if="newsfeed.volunteering.location" class="text-truncate">
          <v-icon name="map-marker-alt" class="fa-fw" />
          {{ newsfeed.volunteering.location }}
        </div>
        <b-btn variant="secondary" class="mt-3 mb-2" @click="moreInfo">
          <v-icon name="info-circle" /> More info
        </b-btn>
      </div>
      <div class="volunteering__photo">
        <b-img
          v-if="newsfeed.volunteering.photo"
          thumbnail
          rounded
          lazy
          :src="newsfeed.volunteering.photo.paththumb"
          class="clickme mt-2 mt-md-0"
          @click="moreInfo"
        />
      </div>
    </div>
    <hr>
    <div class="mt-2d-flex flex-wrap justify-content-between">
      <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
      <div>
        <b-btn variant="white" size="sm" @click="addOpportunity">
          <v-icon name="plus" /> Add your opportunity
        </b-btn>
      </div>
    </div>
    <VolunteerOpportunityModal ref="addOpportunity" :start-edit="true" />
    <VolunteerOpportunityModal ref="moreInfo" :volunteering="newsfeed.volunteering" />
  </div>
</template>

<script>
import NewsBase from '~/components/NewsBase'
import NewsLoveComment from '~/components/NewsLoveComment'
import ProfileImage from '~/components/ProfileImage'
const VolunteerOpportunityModal = () => import('./VolunteerOpportunityModal')

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

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.volunteering__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.volunteering__description {
  width: 100%;

  @include media-breakpoint-up(lg) {
    width: 65%;
    padding-right: 15px;
  }
}

.volunteering__photo {
  width: 100%;

  @include media-breakpoint-up(lg) {
    width: 30%;
  }
}
</style>
