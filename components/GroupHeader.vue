<template>
  <b-card bg-light>
    <b-row v-if="group.profile" class="mt-1">
      <b-col cols="4" sm="2" lg="3" xl="2">
        <b-img-lazy rounded thumbnail alt="Community profile picture" :src="group.profile" class="js-pageimage" />
      </b-col>
      <b-col cols="8" sm="5" lg="9" xl="5">
        <b-card-title>
          {{ group.namedisplay }}
          <v-icon v-if="amAMember === 'Owner' || amAMember === 'Moderator'" name="crown" class="text-success" :title="'You have role ' + amAMember" />
        </b-card-title>
        <b-card-sub-title>{{ group.tagline }}</b-card-sub-title>
        <p v-if="group.membercount" class="text-muted small">
          Founded {{ group.founded | dateonly }}. {{ group.membercount.toLocaleString() }} current freeglers.
          <br>
          See
          <nuxt-link :to="{ path: '/communityevents/' + group.id }">
            community events
          </nuxt-link>,
          <nuxt-link :to="{ path: '/volunteerings/' + group.id }">
            volunteer opportunities
          </nuxt-link>,
          <nuxt-link :to="{ path: '/stories/' + group.id }">
            stories
          </nuxt-link>, or
          <nuxt-link :to="{ path: '/stats/' + group.nameshort }">
            stats
          </nuxt-link>
        </p>
      </b-col>
      <b-col cols="12" sm="5" lg="12" xl="5" class="group-header-buttons">
        <span>
          <b-link :href="'mailto:' + modsemail">
            <b-button class="ml-1 mb-1" variant="white">
              <v-icon name="question-circle" />&nbsp;Contact&nbsp;volunteers
            </b-button>
          </b-link>
          <b-button v-if="!amAMember" class="ml-1 mb-1" variant="success" @click="join">
            <v-icon v-if="joiningOrLeaving" name="sync" class="fa-spin" />
            <v-icon v-else name="plus" />&nbsp;
            Join
          </b-button>
          <b-button v-else-if="amAMember === 'Member'" class="ml-1 mb-1" variant="white" @click="leave">
            <v-icon v-if="joiningOrLeaving" name="sync" class="fa-spin" />
            <v-icon v-else name="trash-alt" />&nbsp;Leave
          </b-button>
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col style="max-height: 300px; overflow-y: auto">
        <p v-if="!group.description">
          Give and get stuff for free with {{ group.namedisplay }}.  Offer things you don't need, and ask for things you'd like.  Don't just recycle - reuse with Freegle!
        </p>
        <!-- eslint-disable-next-line -->
        <span v-if="group.description" v-html="group.description"/>
      </b-col>
    </b-row>
  </b-card>
</template>

<style scoped lang="scss">
.group-header-buttons {
  text-align: right;
  margin-bottom: 20px;
}
</style>

<script>
export default {
  props: {
    group: {
      type: Object,
      required: true
    },
    showJoin: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      joiningOrLeaving: false
    }
  },
  computed: {
    amAMember() {
      const member = this.$store.getters['auth/member'](this.group.id)
      return member
    },
    modsemail() {
      // The server is confused and sometimes returns one or the other.  This is a bug.
      return this.group.modsemail || this.group.modsmail
    }
  },
  methods: {
    async leave() {
      const me = this.$store.getters['auth/user']
      this.joiningOrLeaving = true

      await this.$store.dispatch('auth/leaveGroup', {
        userid: me.id,
        groupid: this.group.id
      })

      this.joiningOrLeaving = false
    },
    async join() {
      const me = this.$store.getters['auth/user']
      this.joiningOrLeaving = true

      await this.$store.dispatch('auth/joinGroup', {
        userid: me.id,
        groupid: this.group.id
      })

      this.joiningOrLeaving = false
    }
  }
}
</script>
