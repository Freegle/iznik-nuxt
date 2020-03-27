<template>
  <div>
    <div class="d-flex">
      <ProfileImage
        v-if="users[userid].profile.turl"
        :image="users[userid].profile.turl"
        class="mr-1 mb-1 mt-1 inline"
        is-thumbnail
        :is-moderator="(Boolean)(users[userid].settings.showmod)"
        size="lg"
      />
      <div>
        <span class="text-success font-weight-bold">{{ users[userid].displayname }}</span>
        created an event<span class="d-none d-md-inline-block">:</span><br class="d-block d-md-none"> <b>{{ newsfeed.communityevent.title }}</b>
        <br>
        <span class="text-muted small">
          {{ newsfeed.added | timeago }}
        </span>
        <span v-if="newsfeed.communityevent.groups.length > 0">
          on {{ newsfeed.communityevent.groups[0].namedisplay }}
        </span>
      </div>
    </div>
    <div class="communityevent__container">
      <div class="communityevent__description">
        <div v-if="newsfeed.communityevent.description" class="text-truncate">
          <v-icon name="info-circle" class="fa-fw" />
          {{ newsfeed.communityevent.description }}
        </div>
        <div v-if="newsfeed.communityevent.location" class="text-truncate">
          <v-icon name="map-marker-alt" class="fa-fw" />
          {{ newsfeed.communityevent.location }}
        </div>
        <div v-if="date">
          <v-icon name="calendar-alt" /> {{ date.start }} - {{ date.end }}
        </div>
        <b-btn variant="primary" class="mt-3 mb-2" @click="moreInfo">
          <v-icon name="info-circle" /> More info
        </b-btn>
      </div>
      <div class="communityevent__photo">
        <b-img
          v-if="newsfeed.communityevent.photo"
          thumbnail
          rounded
          lazy
          :src="newsfeed.communityevent.photo.paththumb"
          class="clickme mt-2 mt-md-0"
          @click="moreInfo"
        />
      </div>
    </div>
    <hr>
    <div class="mt-2">
      <NewsLoveComment :newsfeed="newsfeed" @focus-comment="$emit('focus-comment')" />
      <span class="float-right d-inline-block">
        <b-btn variant="white" size="sm" @click="addEvent">
          <v-icon name="plus" /> Add your event
        </b-btn>
      </span>
    </div>
    <CommunityEventModal ref="addEvent" :start-edit="true" />
    <CommunityEventModal ref="moreInfo" :event="newsfeed.communityevent" />
  </div>
</template>

<script>
import NewsBase from '~/components/NewsBase'
import NewsLoveComment from '~/components/NewsLoveComment'
import ProfileImage from '~/components/ProfileImage'
const CommunityEventModal = () => import('~/components/CommunityEventModal')

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

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.communityevent__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.communityevent__description {
  width: 100%;

  @include media-breakpoint-up(lg) {
    width: 65%;
    padding-right: 15px;
  }
}

.communityevent__photo {
  width: 100%;

  @include media-breakpoint-up(lg) {
    width: 30%;
  }
}
</style>
