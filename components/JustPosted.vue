<template>
  <NoticeMessage v-if="!hidden">
    <b-btn variant="link" class="float-right" @click="hideIt">
      <v-icon name="times-circle" scale="2" />
    </b-btn>
    <div v-if="newuser">
      <NewUser :password="newpassword" class="mb-1" />
    </div>
    <h1 v-else class="text-center">
      Thanks for freegling!
    </h1>
    <h5 class="text-center">
      Replies will show in <em>Chat</em> on this site.  We'll send you an email too
      (check your spam!).
    </h5>
    <MyMessage
      v-for="message in messages"
      :key="'justposted-' + message.id"
      :message="message"
      :messages="[ message ]"
      just-posted
      :show-old="false"
    />
    <div v-if="group">
      <hr>
      <h5 class="text-center">
        We'll show your {{ ids && ids.length !== 1 ? 'posts' : 'post ' }} to communities of nearby freeglers, starting with this one:
      </h5>
      <GroupHeader :group="group" :show-join="false" />
    </div>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
const MyMessage = () => import('~/components/MyMessage.vue')
const GroupHeader = () => import('~/components/GroupHeader.vue')
const NewUser = () => import('~/components/NewUser.vue')

export default {
  components: { MyMessage, GroupHeader, NoticeMessage, NewUser },
  props: {
    ids: {
      type: Array,
      required: true
    },
    newuser: {
      type: Number,
      required: false,
      default: null
    },
    newpassword: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      show: false,
      hidden: false
    }
  },
  computed: {
    messages() {
      const ret = []

      this.ids.forEach(id => {
        const msg = this.$store.getters['messages/get'](id)

        if (msg) {
          ret.push(msg)
        }
      })

      return ret
    },
    groupid() {
      return this.messages && this.messages.length
        ? this.messages[0].groups[0].groupid
        : null
    },
    group() {
      return this.groupid
        ? this.$store.getters['auth/groupById'](this.groupid)
        : null
    }
  },
  async mounted() {
    if (this.ids.length) {
      const promises = []

      // Get the messages into store if not already present.
      this.ids.forEach(id => {
        const message = this.$store.getters['messages/get'](this.id)

        if (!message) {
          // Not in store - fetch.
          console.log('Fetch just posted', this.id)
          promises.push(
            this.$store.dispatch('messages/fetch', {
              id: this.id
            })
          )
        }
      })

      await Promise.allSettled(promises)

      const message = this.$store.getters['messages/get'](this.ids[0])

      if (message) {
        const groupid =
          message && message.id && message.groups
            ? message.groups[0].groupid
            : null

        if (groupid) {
          // Get the group into store if not already present.
          const group = this.$store.getters['auth/groupById'](this.groupid)

          if (!group) {
            console.log('Fetch just posted group', groupid)
            this.$store.dispatch('group/fetch', {
              id: groupid
            })
          }
        }
      }
    }
  },
  methods: {
    hideIt() {
      this.hidden = true
    }
  }
}
</script>
<style lang="scss">
@import 'color-vars';

.tooltip-inner {
  background-color: $color-white;
  color: $color-black;
  border: 1px $color-black solid;
}
.arrow {
  background-color: transparent;
  color: $color-white;
}
</style>
