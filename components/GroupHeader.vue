<template>
  <b-card bg-light>
    <b-row class="mt-1">
      <b-col cols="5" md="2" lg="3" xl="2">
        <b-img-lazy rounded thumbnail alt="Community profile picture" :src="group.profile ? group.profile : '/icon.png'" class="js-pageimage" />
      </b-col>
      <b-col cols="7" md="6" lg="9" class="group-header-description">
        <b-card-title>
          {{ group.namedisplay }}
          <v-icon v-if="amAMember === 'Owner' || amAMember === 'Moderator'" name="crown" class="text-success" :title="'You have role ' + amAMember" />
        </b-card-title>
        <b-card-sub-title>{{ group.tagline }}</b-card-sub-title>
        <p v-if="group.membercount" class="text-muted small">
          Founded {{ group.founded | dateonly }}. {{ group.membercount.toLocaleString() }} current freeglers.
          <br>
          <span class="d-none d-sm-block d-lg-none d-xl-block">
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
          </span>
          <span class="group-header-buttons-small d-none d-sm-block d-md-none">
            <b-button class="mb-1" variant="white" :href="'mailto:' + modsemail">
              <v-icon name="question-circle" />&nbsp;Contact&nbsp;volunteers
            </b-button>
            <b-button v-if="!amAMember" class="mb-1" variant="success" @click="join">
              <v-icon v-if="joiningOrLeaving" name="sync" class="fa-spin" />
              <v-icon v-else name="plus" />&nbsp;
              Join
            </b-button>
            <b-button v-else-if="amAMember === 'Member'" class="mb-1" variant="white" @click="leave">
              <v-icon v-if="joiningOrLeaving" name="sync" class="fa-spin" />
              <v-icon v-else name="trash-alt" />&nbsp;Leave
            </b-button>
          </span>
        </p>
      </b-col>
      <b-col cols="12" md="4" lg="12" class="group-header-buttons">
        <p v-if="group.membercount" class="text-muted small">
          <span class="d-lg-block d-sm-none d-xl-none">
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
          </span>
        </p>
        <span class="d-sm-none d-md-block">
          <b-button class="ml-1 mb-1" variant="white" :href="'mailto:' + modsemail">
            <v-icon name="question-circle" />&nbsp;Contact&nbsp;volunteers
          </b-button>
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
      <b-col class="group-description">
        <p v-if="!group.description">
          Give and get stuff for free with {{ group.namedisplay }}.  Offer things you don't need, and ask for things you'd like.  Don't just recycle - reuse with Freegle!
        </p>
        <!-- eslint-disable-next-line -->
        <span v-if="group.description" v-html="group.description"/>
      </b-col>
    </b-row>
  </b-card>
</template>

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

      if (!me) {
        // We need to force them to log in.
        this.$router.push('/explore/join/' + this.group.id)
      } else {
        this.joiningOrLeaving = true

        await this.$store.dispatch('auth/joinGroup', {
          userid: me.id,
          groupid: this.group.id
        })

        this.joiningOrLeaving = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.group-header-buttons {
  margin-bottom: 20px;
  text-align: right;

  @include media-breakpoint-up(md) {
    text-align: right;
  }

  @include media-breakpoint-up(lg) {
    text-align: left;
  }

  // md, md is intentional. The way bootstrap 'between' mixin works is to take
  // the second argument and find the next breakpoint. So this is effectively
  // active between 768px and 991px.
  @include media-breakpoint-between(md, md) {
    flex: 0 0 33%;
    max-width: 33%;
  }

  @include media-breakpoint-up(xl) {
    flex: 0 0 36%;
    max-width: 36%;
    padding-left: 0;
    text-align: right;
  }
}

.group-header-buttons-small {
  margin-top: 10px;
}

.group-header-description {
  @include media-breakpoint-up(xl) {
    padding-left: 0;
    max-width: 47%;
    flex: 0 0 47%;
  }
}

.img-thumbnail {
  margin-bottom: 20px;
}

.group-description {
  max-height: 300px;
  overflow-y: auto;
}
</style>
