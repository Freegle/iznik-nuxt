<template>
  <div v-if="!me" class="grid m-0 pl-1 pr-1 pl-sm-0 pr-sm-0">
    <div class="map justify-content-start flex-column d-none d-sm-flex">
      <VisualiseMap v-if="type === 'Map'" class="shadow flex-grow-1" />
      <b-embed
        v-else
        ref="video"
        type="video"
        autoplay
        controls
        muted="muted"
        poster="/songpreview.png"
        loop
        class="shadow flex-grow-1"
        src="/song.mp4"
      />
    </div>
    <div class="info">
      <h1 class="largest">
        Freegle - like online dating for stuff.
      </h1>
      <p class="medium black font-weight-bold">
        Got stuff you don't need? Looking for something?
      </p>
      <p class="medium black font-weight-bold">
        We'll match you with someone local.  All completely free.
      </p>
      <div class="d-flex buttons">
        <b-btn variant="primary" size="lg" to="/give" class="medium ml-1 ml-sm-0" @click="clicked('give')">
          Give Stuff
        </b-btn>
        <div style="width: 4vw" class="d-none d-lg-block" />
        <b-btn variant="secondary" size="lg" to="/find" class="medium mr-1 mr-sm-0" @click="clicked('ask')">
          Ask for Stuff
        </b-btn>
      </div>
      <div class="font-weight-bold text-header medium mt-3 mb-4">
        Don't throw it away, give it away!
      </div>
      <h2 class="medium font-weight-bold black">
        Just looking?
      </h2>
      <label class="smaller font-weight-bold">
        <span class="sr-only">
          Enter your location and
        </span>
        See what's being freegled near you.
      </label>
      <div class="d-flex centresmall flex-wrap">
        <PlaceAutocomplete class="mb-2" @selected="explorePlace($event)" />
      </div>
    </div>
    <div class="mobile">
      <a href="https://play.google.com/store/apps/details?id=org.ilovefreegle.direct" class="mt-2" target="_blank">
        <b-img-lazy alt="Freegle Android app on Google Play" title="Freegle Android app on Google Play" class="img-responsive" src="/en-play-badge.png" />
      </a>
      <a href="https://itunes.apple.com/gb/app/freegle/id970045029?ls=1&amp;mt=8" class="mt-2" target="_blank">
        <b-img-lazy alt="Freegle app for iPhone, iPad, and iPod touch" title="Freegle app for iPhone, iPad, and iPod Touch" class="img-responsive" src="/app-store-black-sm.png" />
      </a>
    </div>
    <main-footer class="thefooter" />
  </div>
</template>
<script>
import VisualiseMap from '../components/VisualiseMap'
import PlaceAutocomplete from '../components/PlaceAutocomplete'
import waitForRef from '@/mixins/waitForRef'
const MainFooter = () => import('~/components/MainFooter.vue')

export default {
  components: {
    PlaceAutocomplete,
    VisualiseMap,
    MainFooter
  },
  mixins: [waitForRef],
  data: function() {
    return {
      userWatch: null,
      ourBackground: false
    }
  },
  async asyncData({ store }) {
    let type = 'Map'

    // Ensure we can still load the page if we get an API error.
    try {
      type = await store.$api.bandit.choose({
        uid: 'landing'
      })
    } catch (e) {}

    return {
      type: type.variant
    }
  },
  mounted() {
    if (process.browser) {
      const user = this.$store.getters['auth/user']

      if (user) {
        this.goHome()
      } else {
        // Start the video.
        this.waitForRef('video', () => {
          console.log(this.$refs)
          // this.$refs.video.el.play()
        })

        // Set up a watch on the store.  We do this because initially the store hasn't yet been reloaded from local
        // storage, so we don't know if we're logged in. When it does get loaded, this watch will fire.
        this.userWatch = this.$store.watch(
          (state, getters) => {
            const user = this.$store.getters['auth/user']
            return user
          },
          (newValue, oldValue) => {
            if (newValue) {
              if (this.$nuxt.path === '/' || !this.$nuxt.path) {
                this.goHome()
              }
            }
          }
        )
      }

      this.$api.bandit.shown({
        uid: 'landing',
        variant: this.type
      })

      this.$api.bandit.shown({
        uid: 'landing-button',
        variant: this.type + '-give'
      })

      this.$api.bandit.shown({
        uid: 'landing-button',
        variant: this.type + '-ask'
      })

      this.$api.bandit.shown({
        uid: 'landing-button',
        variant: this.type + '-explore'
      })
    }
  },
  beforeDestroy() {
    if (this.userWatch) {
      this.userWatch()
    }
  },
  methods: {
    goHome() {
      let route = '/browse'

      // Logged in homepage - on client side we want to load the last page, for logged in users.
      try {
        const lastRoute = localStorage.getItem('Iznik>lasthomepage')

        if (lastRoute === 'news') {
          route = '/chitchat'
        } else if (lastRoute === 'myposts') {
          route = '/myposts'
        }

        if (this.$nuxt.path !== route) {
          this.$router.push(route)
        }
      } catch (e) {
        console.log('Exception', e)
      }
    },
    async clicked(button) {
      await this.$api.bandit.chosen({
        uid: 'landing',
        variant: this.type
      })

      await this.$api.bandit.chosen({
        uid: 'landing-button',
        variant: this.type + '-' + button
      })
    },
    async explorePlace(place) {
      await this.$api.bandit.chosen({
        uid: 'landing',
        variant: this.type
      })

      await this.$api.bandit.chosen({
        uid: 'landing-button',
        variant: this.type + '-place'
      })

      this.$router.push({
        name: 'explore-place-place',
        params: {
          place: JSON.stringify(place)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.black {
  color: $color-black !important;
}

.grid {
  display: grid;
  grid-template-columns: 30px 1fr 50px 2fr 0px;
  grid-template-rows: 50px 0.1fr 1.5fr 200px 110px;
  height: 100vh;

  @include media-breakpoint-down(md) {
    grid-template-columns: 0.75fr 0.8fr 30px 1.2fr 0.75fr;
    grid-template-rows: 0px 0fr 0.4fr 0px 1.6fr;
  }

  @include media-breakpoint-down(sm) {
    grid-template-columns: 0fr 0.8fr 30px 1.2fr 0fr;
    grid-template-rows: 0px 0fr 0.4fr 0px 1.6fr;
  }
}

.map {
  grid-column: 2 / 3;
  grid-row: 3 / 5;

  @include media-breakpoint-down(md) {
    grid-column: 2 / 5;
    grid-row: 4 / 6;
  }
}

.info {
  align-self: center;
  justify-self: center;
  grid-column: 4 / 5;
  grid-row: 3 / 4;

  @include media-breakpoint-down(md) {
    grid-column: 2 / 5;
    align-self: center;
    text-align: center;
  }
}

.mobile {
  grid-column: 4 / 5;
  grid-row: 4 / 5;
  justify-self: end;
  align-self: end;

  @include media-breakpoint-down(lg) {
    grid-column: 1 / 2;
    grid-row: 6 / 7;
    align-self: center;
    text-align: center;

    img {
      max-height: 25px;
    }
  }

  @include media-breakpoint-down(sm) {
    grid-column: 1 / 5;
    grid-row: 3 / 5;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-right: 10px;
    padding-left: 10px;
    align-self: end;
    padding-bottom: 10px;
  }

  @include media-breakpoint-down(xs) {
    grid-row: 4 / 5;
    align-self: initial;
  }

  img {
    height: 40px;
  }
}

.thefooter {
  grid-column: 1 / 5;
  grid-row: 6 / 7;
  justify-self: center;
  align-self: center;

  @include media-breakpoint-down(md) {
    grid-column: 2 / 5;
  }
}

.shadow {
  box-shadow: 0px 0px 20px 10px grey !important;

  @include media-breakpoint-down(md) {
    box-shadow: 0px 0px 10px 5px grey !important;
  }

  @include media-breakpoint-down(md) {
    box-shadow: none;
  }
}

.largest {
  font-size: 2rem;
}

@include media-breakpoint-up(md) {
  .largest {
    font-size: 3.5vw;
  }

  .large {
    font-size: 3vw;
  }

  .medium {
    font-size: 2vw;
  }

  .smaller {
    font-size: 1.2vw;
  }

  .small {
    font-size: 1.5vw;
  }
}

.iconlarge {
  min-width: 48px;
}

.buttons {
  justify-content: start;

  @include media-breakpoint-down(md) {
    justify-content: space-between;
  }
}

.centresmall {
  justify-content: start !important;

  @include media-breakpoint-down(md) {
    justify-content: center !important;
  }
}

.explore {
  padding-top: 9px;
  padding-bottom: 9px;
}

::v-deep .autocomplete-wrap {
  border: 3px solid $color-green--darker !important;
}
</style>
