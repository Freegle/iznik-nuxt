<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != myid" class="media">
          <div class="media-left">
            <div class="media-object" @click="zoom = true">
              <b-img-lazy
                v-if="chatmessage.image"
                fluid
                rounded
                thumbnail
                class="chatimage clickme"
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
          <div class="media-body chatMessage" @click="zoom = true">
            <b-img-lazy
              v-if="chatmessage.image"
              fluid
              rounded
              thumbnail
              class="chatimage clickme"
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
    <b-modal
      :id="'photoModal-' + chatmessage.id"
      ref="photoModal"
      v-model="zoom"
      size="lg"
      no-stacking
      ok-only
    >
      <template slot="default">
        <b-img-lazy
          v-if="chatmessage.image"
          fluid
          generator-unable-to-provide-required-alt=""
          :src="chatmessage.image.path"
          @error.native="brokenImage"
        />
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ChatBase from '~/components/ChatBase'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage
  },
  extends: ChatBase,
  data: function() {
    return {
      zoom: false
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = require('~/static/placeholder.jpg')
    }
  }
}
</script>

<style scoped>
.chatimage {
  max-height: 50vh;
}
</style>
