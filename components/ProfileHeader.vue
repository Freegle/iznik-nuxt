<template>
  <b-media>
    <template slot="aside">
      <ProfileImage :image="user.profile.url" class="mb-1 mt-1 inline" is-thumbnail size="xl" />
    </template>
    <b-media-body class="align-top d-flex justify-content-between profile__info">
      <div>
        <h4 class="d-inline-block">
          {{ user.displayname }}
        </h4>
        <div>
          <div class="text-muted">
            <span class="glyphicon glyphicon-heart" /> Freegler since {{ user.added | dateonly }}.
          </div>
          <span v-if="user.settings.showmod" class="text-muted">
            <v-icon name="leaf" /> Freegle Volunteer
          </span>
        </div>
      </div>
      <div>
        <div class="small text-faded mb-1 text-left text-lg-right">
          #{{ id }}
        </div>
        <div class="d-flex flex-row flex-lg-column align-items-baseline">
          <ChatButton
            v-if="id !== myid"
            :userid="id"
            size="sm"
            title="Message"
            class="mb-1 order-1 order-lg-0 align-self-lg-center"
            variant="secondary"
          />
          <ratings :id="id" size="sm" class="pt-1 mr-2 mr-lg-0 d-block" />
        </div>
      </div>
    </b-media-body>
  </b-media>
</template>

<script>
import ProfileImage from '~/components/ProfileImage'
import ChatButton from '~/components/ChatButton'
import Ratings from '~/components/Ratings'

export default {
  components: {
    ProfileImage,
    ChatButton,
    Ratings
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    user() {
      // Look for the user in both the user store (FD) and the members store (MT).  This saves some fetches which can
      // result in weird render errors.
      let ret = null

      if (this.id) {
        let user = this.$store.getters['user/get'](this.id)

        if (user && user.info) {
          ret = user
        } else {
          user = this.$store.getters['members/getByUserId'](this.id)

          if (user && user.info) {
            ret = user
          }
        }
      }

      return ret
    }
  }
}
</script>

<style scoped lang="scss">
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.profile__info {
  flex-direction: column;

  @include media-breakpoint-up(lg) {
    flex-direction: row;
  }
}
</style>
