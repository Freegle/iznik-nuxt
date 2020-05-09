<template>
  <div class="error__wrapper">
    <div class="error__image" />
    <div class="error">
      <h1 v-if="error.statusCode===404">
        <div class="error__heading--main">
          Oh no! That page doesn't seem to exist...
        </div>
        <div class="error__heading--sub">
          Maybe it's been freegled?
        </div>
      </h1>
      <div v-else>
        <h1 class="error__heading--main">
          Oh dear! Something went wrong...
        </h1>
        <p>Error was: {{ JSON.stringify(error) }}</p>
      </div>
      <p>
        <nuxt-link to="/">
          Click here
        </nuxt-link> to go back to the home page
      </p>
      <p>
        Having problems? <a href="mailto:support@ilovefreegle.org">Contact us</a>
      </p>
      <p>
        Request page was: {{url}}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    url() {
      return this.$route.path
    }
  },
  props: {
    error: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.error__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;

  @include media-breakpoint-up(md) {
    flex-direction: row;
  }
}

.error__image {
  background-image: url('~static/error-page-image.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 50%;
  height: 100%;

  @include media-breakpoint-up(md) {
    width: 25%;
  }
}

.error {
  max-width: 600px;
  text-align: center;
}

.error__heading--main {
  font-size: 2.5rem;
}

.error__heading--sub {
  font-size: 1.8rem;
}
</style>
