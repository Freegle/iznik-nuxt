<template>
  <div>
    <RichMarker ref="rich" :key="size" :position="{ lat: user.lat, lng: user.lng }">
      <ProfileImage v-if="size ==='poor'" :image="user.profile ? user.profile.turl : '/defaultprofile.png'" :alt-text="'Profile picture for ' + user.namedisplay" size="sm" border />
      <div v-if="size === 'rich'" class="text-center">
        <ProfileImage :image="user.profile ? user.profile.turl : '/defaultprofile.png'" :alt-text="'Profile picture for ' + user.namedisplay" size="lg" />
        <br>
        <h6 class="text-break mt-1 p-2 bg-white text-success border border-success rounded thick">
          {{ user.displayname }}
        </h6>
        <ChatButton
          v-if="user.userid !== myid && false"
          :userid="user.userid"
          size="sm"
          title="Chat"
          chattype="User2User"
        />
      </div>
    </RichMarker>
  </div>
</template>

<script>
import RichMarker from './RichMarker.vue'
import ChatButton from './ChatButton'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ChatButton,
    RichMarker,
    ProfileImage
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    chat: {
      type: Boolean,
      required: false
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.thick {
  border: 2px solid $color-green--darker !important;
}
</style>
