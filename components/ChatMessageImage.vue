<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != $store.state.auth.user.id" class="media">
          <div class="media-left">
            <div class="media-object">
              <b-img-lazy
                v-if="chatmessage.image"
                fluid
                rounded
                thumbnail
                class=""
                alt="Chat image"
                :src="chatmessage.image.path"
                @error.native="brokenImage"
              />
            </div>
          </div>
          <div class="media-body">
            <b-img-lazy
              rounded="circle"
              thumbnail
              class="profilesm p-0 mb-1 inline mr-1 mt-1"
              alt="Profile picture"
              title="Profile"
              :src="otheruser.profile.turl"
              @error.native="brokenImage"
            />
          </div>
        </div>
        <div v-else class="media float-right">
          <div class="media-body chatMessage">
            <b-img-lazy
              v-if="chatmessage.image"
              fluid
              rounded
              thumbnail
              class=""
              alt="Chat image"
              :src="chatmessage.image.path"
              @error.native="brokenImage"
            />
          </div>
          <div class="media-right">
            <div class="media-object">
              <b-img-lazy
                rounded="circle"
                thumbnail
                class="profilesm p-0 ml-1 mb-1 inline mt-1"
                alt="Profile picture"
                title="Profile"
                :src="me.profile.turl"
                @error.native="brokenImage"
              />
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!chatmessage.sameaslast" class="text-muted small">
      <b-col v-if="chatmessage.userid != $store.state.auth.user.id">
        <span style="padding-left: 30px">
          {{ $dayjs(chatmessage.date).fromNow() }}
        </span>
      </b-col>
      <b-col v-else>
        <span class="float-right" style="padding-right: 30px">
          {{ $dayjs(chatmessage.date).fromNow() }}
        </span>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
export default {
  props: {
    chat: {
      type: Object,
      required: true
    },
    chatmessage: {
      type: Object,
      required: true
    },
    me: {
      type: Object,
      required: true
    },
    otheruser: {
      type: Object,
      required: true
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
