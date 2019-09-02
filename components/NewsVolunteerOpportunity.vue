<template>
  <div>
    <b-row>
      <b-col>
        <b-img-lazy
          v-if="users[userid].profile.turl"
          rounded="circle"
          thumbnail
          class="profile p-0 ml-1 mb-1 inline float-left"
          alt="Profile picture"
          title="Profile"
          :src="users[userid].profile.turl"
          @error.native="brokenImage"
        />
        <v-icon v-if="users[userid].settings.showmod" name="leaf" class="showmod text-success" />
        <span class="text-success font-weight-bold pl-2">
          {{ users[userid].displayname }}
        </span>
        posted a volunteering opportunity: <b>{{ newsfeed.volunteering.title }}</b>
        <br>
        <span class="text-muted small pl-2">
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
        <b-btn variant="primary" class="mt-2" @click="details">
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
          class="clickme d-inline-block float-right"
          @click="details"
        />
      </b-col>
    </b-row>
    <hr>
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <span class="float-right d-inline-block">
          <b-btn variant="white" size="sm" @click="add">
            <v-icon name="plus" /> Add your opportunity
          </b-btn>
        </span>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
import NewsBase from '~/components/NewsBase'
const NewsLoveComment = () => import('~/components/NewsLoveComment')

export default {
  components: {
    NewsLoveComment
  },
  extends: NewsBase,
  methods: {
    add() {
      // TODO
    },
    details() {
      // TODO
    }
  }
}
</script>
