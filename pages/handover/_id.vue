<template>
  <b-row class="m-0">
    <b-col cols="0" xl="3" class="d-none d-xl-block" />
    <b-col cols="12" xl="6" class="p-0">
      <b-card v-if="tryst && otheruser" border-variant="success">
        <b-card-title>
          <h1 class="header--size2">
            Handover with {{ otheruser.displayname }} on {{ trystdate }}
          </h1>
        </b-card-title>
        <b-card-text>
          <p v-if="confirmed" class="mb-4">
            Great.  Hope it goes smoothly!
          </p>
          <div v-else class="d-flex justify-content-start">
            <div class="mb-4">
              <p>
                Is this still OK?
              </p>
              <div class="d-flex justify-content-start flex-wrap">
                <b-btn variant="primary" size="lg" class="mr-4" @click="confirm">
                  Yes, still OK
                </b-btn>
                <b-btn variant="secondary" size="lg" @click="decline">
                  No, it's not
                </b-btn>
              </div>
            </div>
          </div>
        </b-card-text>
      </b-card>
      <div v-else class="text-center">
        <b-img src="~/static/loader.gif" alt="Loading..." />
      </div>
    </b-col>
  </b-row>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: {},
  mixins: [loginRequired],
  data: function() {
    return {
      id: null,
      confirmed: false
    }
  },
  computed: {
    tryst() {
      return this.id ? this.$store.getters['tryst/get'](this.id) : null
    },
    trystdate() {
      return this.tryst
        ? this.$dayjs(this.tryst.arrangedfor).format('dddd Do HH:mm a')
        : null
    },
    otheruid() {
      let ret = null

      if (this.tryst) {
        ret =
          this.tryst.user1 === this.myid ? this.tryst.user2 : this.tryst.user1
      }

      return ret
    },
    otheruser() {
      return this.otheruid
        ? this.$store.getters['user/get'](this.otheruid)
        : null
    }
  },
  watch: {
    async tryst(newVal, oldVal) {
      if (oldVal === null && newVal !== null) {
        // We've loaded it.  Get the other user.
        const uid = newVal.user1 === this.myid ? newVal.user2 : newVal.user1
        await this.$store.dispatch('user/fetch', {
          id: uid
        })
      }
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id) || null
  },
  methods: {
    async confirm() {
      await this.$store.dispatch('tryst/confirm', {
        id: this.id
      })

      this.confirmed = true
    },
    async decline() {
      await this.$store.dispatch('tryst/confirm', {
        id: this.id
      })

      const chatid = await this.$store.dispatch('chats/openChatToUser', {
        userid: this.otheruid,
        chattype: 'User2User'
      })

      this.$router.push('/chats/' + chatid).catch(() => {})
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';
</style>
