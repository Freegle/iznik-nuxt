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
            {{ $dayjs(newsfeed.timestamp).fromNow() }}
          </span>
          <NewsUserInfo :user="users[userid]" />
        </div>
      </div>
      <ProfileModal v-if="infoclick" :id="userid" ref="profilemodal" />
    </b-col>
  </b-row>
</template>
<style scoped>
/*TODO DESIGN This showmod leaf appears in the wrong place on mobile because profile is smaller then.  This should*/
/*be handled better.  Applies in other places - search for "leaf" to find possibilities.*/
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
</style>
<script>
const NewsUserInfo = () => import('~/components/NewsUserInfo')
const ProfileModal = () => import('~/components/ProfileModal')

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

      // TODO I tried nextTick here, and the ref wasn't defined in the callback.  So this is a hack.
      // Might relate to use of async import stuff.
      setTimeout(() => {
        this.$refs.profilemodal.show()
      }, 25)
    },
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
