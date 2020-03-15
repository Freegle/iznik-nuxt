<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != myid" class="media">
          <div class="media-left">
            <div class="media-object">
              <b-img-lazy
                v-if="chatmessage.image"
                fluid
                rounded
                thumbnail
                class="chatimage"
                generator-unable-to-provide-required-alt=""
                :src="chatmessage.image.path"
                @error.native="brokenImage"
              />
            </div>
          </div>
          <div class="media-body">
            <ProfileImage v-if="otheruser" :image="otheruser.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
          </div>
        </div>
        <div v-else class="media float-right">
          <div class="media-body chatMessage">
            <b-img-lazy
              v-if="chatmessage.image"
              fluid
              rounded
              thumbnail
              class="chatimage"
              generator-unable-to-provide-required-alt=""
              :src="chatmessage.image.path"
              @error.native="brokenImage"
            />
          </div>
          <div class="media-right">
            <div class="media-object">
              <ProfileImage :image="me.profile.turl" class="mr-1 ml-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import ChatBase from '~/components/ChatBase'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage
  },
  extends: ChatBase
}
</script>

<style scoped>
.chatimage {
  max-height: 50vh;
}
</style>
