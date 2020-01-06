<template>
  <div>
    <b-row>
      <b-col>
        <profile-image v-if="users[userid].profile.turl" :image="users[userid].profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="lg" />
        <v-icon v-if="users[userid].settings.showmod" name="leaf" class="showmod text-success" />
        <span class="text-success font-weight-bold">{{ users[userid].displayname }}</span>
        created an event: <b>{{ newsfeed.communityevent.title }}</b>
        <br>
        <span class="text-muted small">
          {{ $dayjs(newsfeed.timestamp).fromNow() }}
        </span>
        <span v-if="newsfeed.communityevent.groups.length > 0">
          on {{ newsfeed.communityevent.groups[0].namedisplay }}
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" :lg="newsfeed.communityevent.photo ? 8 : 12">
        <span v-if="newsfeed.communityevent.description" class="text-truncate d-block">
          <v-icon name="info-circle" class="fa-fw" /> {{ newsfeed.communityevent.description }}
        </span>
        <span v-if="newsfeed.communityevent.location" class="text-truncate d-block">
          <v-icon name="map-marker-alt" class="fa-fw" /> {{ newsfeed.communityevent.location }}
        </span>
        <span v-if="date">
          <v-icon name="calendar-alt" /> {{ date.start }} - {{ date.end }}
        </span>
        <br>
        <b-btn variant="primary" class="mt-2" @click="moreInfo">
          <v-icon name="info-circle" class="fa-fw" /> More info
        </b-btn>
      </b-col>
      <b-col v-if="newsfeed.communityevent.photo" cols="12" lg="4">
        <b-img
          thumbnail
          rounded
          lazy
          :src="newsfeed.communityevent.photo.paththumb"
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
          <b-btn variant="white" size="sm" @click="addEvent">
            <v-icon name="plus" /> Add your event
          </b-btn>
        </span>
      </b-col>
    </b-row>
    <CommunityEventModal ref="addEvent" :start-edit="true" />
    <CommunityEventModal ref="moreInfo" :event="newsfeed.communityevent" />
  </div>
</template>
<style scoped>
</style>
<script>
import NewsBase from '~/components/NewsBase'
import NewsLoveComment from '~/components/NewsLoveComment'
const CommunityEventModal = () => import('~/components/CommunityEventModal')
const ProfileImage = () => import('~/components/ProfileImage')

export default {
  components: {
    NewsLoveComment,
    CommunityEventModal,
    ProfileImage
  },
  extends: NewsBase,
  computed: {
    date() {
      // Similar code to CommunityEvent
      let ret = null
      const dates = this.newsfeed.communityevent.dates
      let count = 0
      const Moment = this.$dayjs

      if (dates) {
        for (let i = 0; i < dates.length; i++) {
          const date = dates[i]
          if (
            new Moment().diff(date.end) < 0 ||
            new Moment().isSame(date.end, 'day')
          ) {
            if (count === 0) {
              const startm = new Moment(date.start)
              let endm = new Moment(date.end)
              endm = endm.isSame(startm, 'day')
                ? endm.format('HH:mm')
                : endm.format('ddd, Do MMM HH:mm')
              ret = {
                start: startm.format('ddd, Do MMM HH:mm'),
                end: endm
              }
            }

            count++
          }
        }
      }

      return ret
    }
  },
  methods: {
    moreInfo() {
      this.$refs.moreInfo.show()
    },
    addEvent() {
      this.$refs.addEvent.show()
    }
  }
}
</script>
