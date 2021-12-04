<template>
  <div v-if="group && group.onmap">
    <div class="layout">
      <div class="profile">
        <GroupProfileImage :image="group.profile ? group.profile : '/icon.png'" :alt-text="'Profile picture for ' + group.namedisplay" />
      </div>
      <nuxt-link :to="'/explore/' + group.nameshort" class="name font-weight-bold">
        {{ group.namedisplay }}
      </nuxt-link>
      <div class="tagline">
        <div v-if="group.tagline">
          {{ group.tagline }}
        </div>
        <ExternalLink :href="'mailto:' + group.modsmail" class="text-muted small">
          <v-icon name="envelope" title="Contact volunteers" scale="0.8" /> Contact volunteers
        </ExternalLink>
      </div>
      <div class="join">
        <b-btn variant="primary" :to="'/explore/join/' + group.id">
          Join
        </b-btn>
      </div>
      <div class="explore">
        <div>
          <b-btn variant="secondary" :to="'/explore/' + group.nameshort">
            Explore
          </b-btn>
        </div>
      </div>
    </div>
    <hr class="text-muted mt-0">
  </div>
</template>
<script>
import ExternalLink from './ExternalLink'
import GroupProfileImage from './GroupProfileImage'

export default {
  components: { GroupProfileImage, ExternalLink },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.id)
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.layout {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto auto auto auto;
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;

  .profile {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    margin-left: 0.5rem;

    /deep/ .img-thumbnail {
      max-width: unset;
    }
  }

  .name {
    grid-column: 2 / 4;
    grid-row: 1 / 2;

    @include media-breakpoint-up(lg) {
      grid-column: 2 / 3;
    }
  }

  .tagline {
    grid-column: 2 / 4;
    grid-row: 2 / 3;

    @include media-breakpoint-up(lg) {
      grid-column: 2 / 3;
    }
  }

  .join {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
    margin-left: 0.5rem;

    @include media-breakpoint-up(lg) {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      margin-left: unset;
      margin-right: 0.5rem;
      display: flex;
      justify-content: flex-end;
    }
  }

  .explore {
    grid-column: 3 / 4;
    grid-row: 3 / 4;
    margin-right: 0.5rem;
    display: flex;
    justify-content: flex-end;

    @include media-breakpoint-up(lg) {
      grid-column: 3 / 4;
      grid-row: 2 / 3;
    }
  }
}
</style>
