<template>
  <b-row>
    <b-col v-if="userid && users[userid]" class="clickme" title="Click to see their profile" @click="showInfo">
      <div class="media clickme">
        <div class="media-left">
          <div class="media-object">
            <b-img-lazy
              v-if="users[userid].profile.turl"
              rounded="circle"
              thumbnail
              class="profile p-0 ml-1 mb-1 inline float-left"
              alt="Profile picture"
              title="Profile"
              :src="users[userid].profile.turl"
              @error.native="brokenImage"
              @click="showInfo"
            />
            <v-icon v-if="users[userid].settings.showmod" name="leaf" class="showmod text-success" />
          </div>
        </div>
        <div class="media-body ml-2">
          <span class="text-success font-weight-bold">
            {{ users[userid].displayname }}
          </span>
          {{ append }}
          <span v-if="appendBold">
            "{{ appendBold }}"
          </span>
          <br>
          <span class="text-muted small pl-0">
            {{ $dayjs(newsfeed.added).fromNow() }}
          </span>
          <NewsUserInfo :user="users[userid]" />
        </div>
      </div>
      <ProfileModal v-if="infoclick" :id="userid" ref="profilemodal" />
    </b-col>
  </b-row>
</template>
<script>
// Use import rather than async otherwise we have trouble with refs.
import ProfileModal from '~/components/ProfileModal'

const NewsUserInfo = () => import('~/components/NewsUserInfo')

export default {
  components: {
    NewsUserInfo,
    ProfileModal
  },
  props: {
    userid: {
      type: Number,
      required: true
    },
    users: {
      type: Object,
      required: true
    },
    newsfeed: {
      type: Object,
      required: true
    },
    append: {
      type: String,
      required: false,
      default: ''
    },
    appendBold: {
      type: String,
      required: false,
      default: ''
    }
  },
  data: function() {
    return {
      infoclick: false
    }
  },
  methods: {
    showInfo() {
      // We use v-if so that the profile modal is not inserted into the DOM until we have clicked, which saves the
      // fetch of the user info.
      this.infoclick = true
      this.$nextTick(() => {
        this.$refs.profilemodal.show()
      })
    },
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
