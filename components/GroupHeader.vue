<template>
  <b-card bg-light>
    <div class="group">
      <div class="group__image">
        <b-img-lazy rounded thumbnail alt="Community profile picture" :src="group.profile ? group.profile : '/icon.png'" class="js-pageimage" />
      </div>
      <div class="group__title">
        <b-card-title>
          {{ group.namedisplay }}
          <v-icon v-if="amAMember === 'Owner' || amAMember === 'Moderator'" name="crown" class="text-success" :title="'You have role ' + amAMember" />
        </b-card-title>
        <b-card-sub-title>{{ group.tagline }}</b-card-sub-title>
        <div v-if="group.membercount" class="text-muted small">
          Founded {{ group.founded | dateonly }}. {{ group.membercount.toLocaleString() }} current freeglers.
        </div>
      </div>
      <div class="group__links text-muted small">
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
      </div>
      <div class="mt-2 group__buttons">
        <div class="button__items">
          <b-button class="mb-1" variant="white" :href="'mailto:' + modsemail">
            <v-icon name="question-circle" />&nbsp;Contact&nbsp;volunteers
          </b-button>
          <b-button v-if="!amAMember" class="mb-1 ml-1" variant="success" @click="join">
            <v-icon v-if="joiningOrLeaving" name="sync" class="fa-spin" />
            <v-icon v-else name="plus" />&nbsp;
            Join
          </b-button>
          <b-button v-else-if="amAMember === 'Member'" class="mb-1 ml-1" variant="white" @click="leave">
            <v-icon v-if="joiningOrLeaving" name="sync" class="fa-spin" />
            <v-icon v-else name="trash-alt" />&nbsp;Leave
          </b-button>
        </div>
      </div>
    </div>
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

.img-thumbnail {
  margin-bottom: 20px;
}

.group-description {
  max-height: 300px;
  overflow-y: auto;
}

.group {
  display: grid;

  grid-template-columns: 40% auto;

  @include media-breakpoint-up(sm) {
    grid-template-columns: 30% auto;
  }

  @include media-breakpoint-up(md) {
    grid-template-columns: 15% auto 36%;
  }

  @include media-breakpoint-up(lg) {
    grid-template-columns: 25% auto;
  }

  @include media-breakpoint-up(xl) {
    grid-template-columns: 15% auto 36%;
  }
}

.group__image {
  grid-column: 1 / 2;
  grid-row: 1 / 2;

  padding-right: 15px;

  @include media-breakpoint-up(sm) {
    grid-row: 1 / 4;
  }

  @include media-breakpoint-up(md) {
    grid-row: 1 / 3;
  }

  @include media-breakpoint-up(lg) {
    grid-row: 1 / 2;
  }

  @include media-breakpoint-up(xl) {
    grid-row: 1 / 3;
  }
}

.group__title {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.group__links {
  grid-column: 1 / 3;
  grid-row: 2 / 3;

  @include media-breakpoint-up(sm) {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }

  @include media-breakpoint-up(lg) {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }

  @include media-breakpoint-up(xl) {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
}

.group__buttons {
  grid-column: 1 / 3;
  grid-row: 3 / 4;
  justify-self: start;

  @include media-breakpoint-up(sm) {
    grid-column: 2 / 3;
    justify-self: start;
  }

  @include media-breakpoint-up(md) {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
    justify-self: end;
  }

  @include media-breakpoint-up(lg) {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    justify-self: start;
  }

  @include media-breakpoint-up(xl) {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    justify-self: end;
  }
}

.button__items {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  @include media-breakpoint-up(sm) {
    flex-direction: row;
    justify-content: flex-start;
  }

  @include media-breakpoint-up(md) {
    flex-direction: row;
    justify-content: flex-end;
  }

  @include media-breakpoint-up(lg) {
    flex-direction: row;
    justify-content: flex-start;
  }

  @include media-breakpoint-up(xl) {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
