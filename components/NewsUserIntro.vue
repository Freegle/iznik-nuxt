<template>
  <b-row>
    <b-col v-if="userid && users[userid]">
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
      {{ append }}
      <span v-if="appendBold">
        "{{ appendBold }}"
      </span>
      <br>
      <span class="text-muted small pl-2">
        {{ $moment(newsfeed.timestamp).fromNow() }}
      </span>
      <NewsUserInfo :user="users[userid]" />
    </b-col>
  </b-row>
</template>
<style scoped>
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
import NewsUserInfo from '~/components/NewsUserInfo'

export default {
  components: {
    NewsUserInfo
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
  }
}
</script>
