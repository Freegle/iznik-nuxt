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
          {{ $moment(newsfeed.timestamp).fromNow() }}
        </span>
        on {{ newsfeed.volunteering.groups[0].namedisplay }}
      </b-col>
    </b-row>
    <b-row v-if="newsfeed.volunteering && newsfeed.volunteering.photo">
      <b-col>
        <b-img
          thumbnail
          rounded
          lazy
          :src="newsfeed.volunteering.photo.paththumb"
          class="clickme"
          @click="details"
        />
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col class="eventDescription">
        {{ newsfeed.volunteering.description }}
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
        <span class="float-right d-inline-block">
          <b-btn variant="white" size="sm" @click="add">
            <v-icon name="plus" /> Add your opportunity
          </b-btn>
          <b-btn variant="primary" size="sm" @click="details">
            <v-icon name="info-circle" /> More info
          </b-btn>
        </span>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
.eventDescription {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
}
</style>
<script>
import NewsBase from '~/components/NewsBase'
import NewsLoveComment from '~/components/NewsLoveComment'

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
