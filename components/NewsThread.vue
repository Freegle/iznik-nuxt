<template>
  <div v-if="newsfeed && newsfeed.visible && !newsfeed.unfollowed" class="bg-white">
    <b-card>
      <b-card-text>
        <b-row>
          <b-col v-if="userid">
            <div>
              <b-img-lazy
                v-if="users[userid].profile.turl"
                rounded="circle"
                thumbnail
                class="profile p-0 ml-1 mb-1 inline float-left"
                alt="Profile picture"
                title="Profile"
                :src="users[userid].profile.turl"
              />
              <fa v-if="users[userid].settings.showmod" icon="leaf" class="showmod text-success" />
              <span class="text-success font-weight-bold pl-2">
                {{ users[userid].displayname }}
              </span>
              <span v-if="newsfeed.type === 'AboutMe'">
                introduced themselves
              </span>
              <span v-if="newsfeed.type === 'CommunityEvent'">
                created an event: <b>{{ newsfeed.communityevent.title }}</b>
              </span>
              <span v-if="newsfeed.type === 'VolunteerOpportunity'">
                posted a volunteering opportunity: <b>{{ newsfeed.volunteering.title }}</b>
              </span>
              <br>
              <span class="text-muted small pl-2">
                {{ $moment(newsfeed.timestamp).fromNow() }}
                <span v-if="newsfeed.communityevent">
                  on {{ newsfeed.communityevent.groups[0].namedisplay }}
                </span>
              </span>
              <NewsUserInfo v-if="newsfeed.type !== 'CommunityEvent' && newsfeed.type !== 'VolunteerOpportunity'" :user="users[userid]" />
            </div>
          </b-col>
        </b-row>
        <div v-if="newsfeed.communityevent">
          <b-row>
            <b-col>
              <fa icon="calendar-alt" /> {{ $moment(newsfeed.communityevent.dates[0].start).format('ddd, Do MMMM h:mma') }}
              <span v-if="newsfeed.communityevent.dates.length > 1" class="text-muted">
                ...+{{ newsfeed.communityevent.dates.length - 1 }} more {{ newsfeed.communityevent.dates.length | pluralize('date') }}
              </span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <fa icon="map-marker" /> {{ newsfeed.communityevent.location }}
            </b-col>
          </b-row>
        </div>
        <div v-if="newsfeed.volunteering">
          <b-row>
            <b-col class="volunteerDescription">
              <fa icon="info-circle" /> <span>{{ newsfeed.volunteering.description }}</span>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <fa icon="map-marker" /> {{ newsfeed.volunteering.location }}
            </b-col>
          </b-row>
        </div>
        <b-row v-if="newsfeed.message">
          <b-col>
            <span class="font-weight-bold prewrap">{{ emessage }}</span>
          </b-col>
        </b-row>
        <div>
          <b-row v-if="newsfeed.image">
            <b-col>
              <b-img
                v-b-modal="'photoModal-' + newsfeed.id"
                thumbnail
                rounded
                lazy
                :src="newsfeed.image.paththumb"
                class="clickme"
              />
            </b-col>
          </b-row>
          <b-row v-if="newsfeed.communityevent && newsfeed.communityevent.photo">
            <b-col>
              <b-img
                thumbnail
                rounded
                lazy
                :src="newsfeed.communityevent.photo.paththumb"
                class="clickme"
                @click="eventDetails"
              />
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
                @click="eventDetails"
              />
            </b-col>
          </b-row>
        </div>
        <b-row class="mt-2">
          <b-col>
            <ul class="list-unstyled list-inline d-inline-block">
              <li class="list-inline-item">
                <b-btn v-if="!newsfeed.loved" variant="white" size="sm" @click="love">
                  <fa icon="heart" />&nbsp;Love this
                </b-btn>
                <b-btn v-if="newsfeed.loved" variant="white" size="sm" @click="unlove">
                  <fa class="text-danger" icon="heart" />&nbsp;Unlove this
                </b-btn>
              </li>
              <li v-if="!newsfeed.closed" class="list-inline-item">
                <b-btn variant="white" size="sm" @click="focusComment">
                  <fa icon="comment" />&nbsp;Comment
                </b-btn>
              </li>
              <li class="list-inline-item">
                <span v-if="newsfeed.loves">
                  <fa icon="heart" class="text-danger" />&nbsp;{{ newsfeed.loves }}
                </span>
              </li>
            </ul>
            <b-btn v-if="newsfeed.type === 'Message'" variant="white" size="sm" class="float-right d-inline-block">
              <fa icon="share-alt" /> Share
            </b-btn>
            <span v-if="newsfeed.type === 'CommunityEvent'" class="float-right d-inline-block">
              <b-btn variant="info" size="sm" @click="eventDetails">
                <fa icon="info-circle" /> More info
              </b-btn>
              <b-btn variant="white" size="sm" @click="eventAdd">
                <fa icon="plus" /> Add your event
              </b-btn>
            </span>
            <span v-if="newsfeed.type === 'VolunteerOpportunity'" class="float-right d-inline-block">
              <b-btn variant="info" size="sm" @click="volunteerDetails">
                <fa icon="info-circle" /> More info
              </b-btn>
              <b-btn variant="white" size="sm" @click="addVolunteer">
                <fa icon="plus" /> Add your opportunity
              </b-btn>
            </span>
          </b-col>
        </b-row>
      </b-card-text>
      <div slot="footer">
        <div v-if="newsfeed.replies && newsfeed.replies.length > 0">
          <ul v-for="(entry, $index) in newsfeed.replies" :key="'newsfeed-' + $index" class="p-0 pt-1 list-unstyled mb-1">
            <li>
              <news-reply :key="'newsfeedreply-' + newsfeed.id + '-reply-' + entry.id" :reply="entry" :users="users" :threadhead="newsfeed" />
            </li>
          </ul>
        </div>
        <span v-if="!newsfeed.closed" class="text-small">
          <b-row>
            <b-col>
              <b-input-group>
                <b-input-group-prepend>
                  <span class="input-group-text pl-1 pr-1">
                    <b-img-lazy
                      v-if="me.profile.turl"
                      rounded="circle"
                      thumbnail
                      class="profilesm p-0 m-0 inline float-left"
                      alt="Profile picture"
                      title="Profile"
                      :src="me.profile.turl"
                    />
                  </span>
                </b-input-group-prepend>
                <b-textarea
                  ref="threadcomment"
                  v-model="threadcomment"
                  size="sm"
                  rows="1"
                  max-rows="8"
                  maxlength="2048"
                  spellcheck="true"
                  placeholder="Write a comment..."
                  class="p-0 pl-1 pt-1"
                  @keydown.enter.exact.prevent
                  @keyup.enter.exact="sendComment"
                  @keydown.enter.shift.exact="newlineComment"
                  @keydown.alt.shift.exact="newlineComment"
                  @focus="focusedComment"
                />
              </b-input-group>
            </b-col>
            <b-col cols="1" class="p-0">
              <b-btn size="sm" variant="primary" class="float-right">
                <fa icon="camera" />&nbsp;Photo
              </b-btn>
            </b-col>
          </b-row>
        </span>
        <b-alert v-else variant="info" show>
          This thread is now closed.  Thanks to everyone who contributed.
        </b-alert>
      </div>
    </b-card>
    <b-modal
      v-if="newsfeed.image"
      :id="'photoModal-' + newsfeed.id"
      ref="photoModal"
      title="ChitChat Photo"
      alt="ChitChat Photo"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <b-img
          fluid
          rounded
          center
          :src="newsfeed.image.path"
        />
      </template>
    </b-modal>
  </div>

  <!-- TODO 'CentralPublicity':-->
  <!-- TODO 'Alert':-->
  <!-- TODO 'Story':-->
  <!-- TODO 'Noticeboard':-->
</template>
<style scoped>
.profile {
  width: 50px !important;
  height: 50px !important;
}

.profilesm {
  width: 25px !important;
  height: 25px !important;
}

.showmod {
  top: 29px;
  left: 44px;
  border-radius: 50%;
  position: absolute;
  background-color: white;
  width: 24px;
  height: 24px;
  padding-left: 5px;
  padding-top: 4px;
  border: 1px solid green;
}

.volunteerDescription {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
}
</style>
<script>
// TODO Show earlier for replies; currently limited to 10
// TODO Click to show profile
// TODO Love this function
// TODO Post photos
// TODO Report etc menu dropdown
// TODO Alt+Enter
// TODO Delete
// TODO Edit
// TODO Some indication of newly added entries
// TODO Share
// TODO Click on loves to show who loves them
import twem from '~/assets/js/twem'
import NewsUserInfo from '~/components/NewsUserInfo'
import NewsReply from '~/components/NewsReply'

export default {
  components: {
    NewsUserInfo,
    NewsReply
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    users: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      replyingTo: null,
      threadcomment: null
    }
  },
  computed: {
    emessage() {
      return this.newsfeed.message
        ? twem.twem(this.$twemoji, this.newsfeed.message)
        : null
    },
    me() {
      return this.$store.state.auth.user
    },
    newsfeed() {
      return this.$store.getters['newsfeed/get'](this.id)
    },
    userid() {
      // The API returns userid in the summary and user.id when we get an individual object, so we need to
      // mess about to get the userid.
      const newsfeed = this.$store.getters['newsfeed/get'](this.id)
      let ret = null

      if (newsfeed) {
        if (newsfeed.userid) {
          ret = newsfeed.userid
        } else if (newsfeed.user) {
          ret = newsfeed.user.id
        }
      }

      return ret
    }
  },
  methods: {
    focusComment: function() {
      this.$refs.threadcomment.focus()
    },
    focusedComment: function() {
      this.replyingTo = this.newsfeed.id
    },
    async sendComment() {
      // Encode up any emojis.
      if (this.threadcomment) {
        const msg = twem.untwem(this.threadcomment)

        await this.$store.dispatch('newsfeed/send', {
          message: msg,
          replyto: this.replyingTo,
          threadhead: this.newsfeed.threadhead
        })

        // New message will be shown because it's in the store and we have a computed property.

        // Clear the textarea now it's sent.
        this.threadcomment = null
      }
    },
    newlineComment() {
      this.threadcomment += '\n'
    },
    love() {
      this.$store.dispatch('newsfeed/love', {
        id: this.newsfeed.id,
        replyto: this.replyingTo,
        threadhead: this.newsfeed.threadhead
      })
    },
    unlove() {
      this.$store.dispatch('newsfeed/unlove', {
        id: this.newsfeed.id,
        replyto: this.replyingTo,
        threadhead: this.newsfeed.threadhead
      })
    },
    eventDetails() {
      // TODO
    },
    eventAdd() {
      // TODO
    },
    volunteerDetails() {
      // TODO
    },
    volunteerAdd() {
      // TODO
    }
  }
}
</script>
