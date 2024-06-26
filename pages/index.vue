<template>
  <div v-if="!me" class="grid m-0 pl-1 pr-1 pl-sm-0 pr-sm-0 mt-0 mt-lg-5 ml-2 mr-2">
    <client-only>
      <Visible :not="['xs']" class="map justify-content-start flex-column d-flex">
        <VisualiseMap v-if="type === 'Map'" class="shadow flex-grow-1" />
        <div v-else-if="type === 'Song'">
          <b-img v-if="!timeToPlay" fluid src="/songpreview.png" class="flex-grow-1 w-100" @click="play" />
          <b-embed
            v-else
            ref="video"
            type="video"
            autoplay
            controls
            poster="/songpreview.png"
            loop
            class="shadow flex-grow-1"
            src="/song.mp4"
          />
        </div>
      </Visible>
    </client-only>
    <div class="info">
      <h1 class="text--largest-responsive">
        Freegle - like online dating for stuff.
      </h1>
      <p class="text--medium-responsive black font-weight-bold">
        Got stuff you don't need? Looking for something?
      </p>
      <p class="text--medium-responsive black font-weight-bold">
        We'll match you with someone local.  All completely free.
      </p>
      <div class="d-flex buttons">
        <b-btn variant="primary" size="lg" to="/give" class="text--medium-responsive ml-1 ml-sm-0" @click="clicked('give')">
          Give Stuff
        </b-btn>
        <div style="width: 4vw" class="d-none d-lg-block" />
        <b-btn variant="secondary" size="lg" to="/find" class="text--medium-responsive mr-1 mr-sm-0" @click="clicked('ask')">
          Ask for Stuff
        </b-btn>
      </div>
      <div class="font-weight-bold text-header text--medium-responsive mt-3 mb-4">
        Don't throw it away, give it away!
      </div>
      <h2 class="text--medium-responsive font-weight-bold black">
        Just looking?
      </h2>
      <div class="d-flex centresmall flex-wrap">
        <PlaceAutocomplete class="mb-2" labeltext="See what's being freegled near you." labeltext-sr="Enter your location and" @selected="explorePlace($event)" />
      </div>
    </div>
    <div class="app-download mt-2">
      <a href="https://play.google.com/store/apps/details?id=org.ilovefreegle.direct" target="_blank" class="mr-2" rel="noopener noreferrer">
        <b-img-lazy alt="Freegle Android app on Google Play" title="Freegle Android app on Google Play" class="app-download__image" src="/en-play-badge.png" />
      </a>
      <a href="https://itunes.apple.com/gb/app/freegle/id970045029?ls=1&amp;mt=8" target="_blank" rel="noopener noreferrer">
        <b-img-lazy alt="Freegle app for iPhone, iPad, and iPod touch" title="Freegle app for iPhone, iPad, and iPod Touch" class="app-download__image" src="/app-store-black-sm.png" />
      </a>
    </div>
    <main-footer class="thefooter" />
  </div>
</template>
<script>
import PlaceAutocomplete from '../components/PlaceAutocomplete'
import Visible from '../components/Visible'
const VisualiseMap = () => import('../components/VisualiseMap')
const MainFooter = () => import('~/components/MainFooter.vue')

export default {
  components: {
    Visible,
    PlaceAutocomplete,
    VisualiseMap,
    MainFooter
  },

  data: function() {
    return {
      userWatch: null,
      ourBackground: false,
      type: null,
      timeToPlay: false
    }
  },
  async mounted() {
    if (process.client) {
      await this.fetchMe(['me', 'groups'])

      if (this.me) {
        this.goHome()
      } else {
        // Ensure we can still load the page if we get an API error.
        try {
          const type = await this.$store.$api.bandit.choose({
            uid: 'landing'
          })

          this.type = type.variant
        } catch (e) {}

        if (this.type !== 'Map') {
          // The video plays with sound, wrongly, even if the muted attribute is set.  So set it here.
          setTimeout(() => {
            this.timeToPlay = true
            this.play()
          }, 1000)
        }

        // Set up a watch on the store.  We do this because initially the store hasn't yet been reloaded from local
        // storage, so we don't know if we're logged in. When it does get loaded, this watch will fire.
        this.userWatch = this.$store.watch(
          (state, getters) => {
            return this.me
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
        const lastRoute = this.$store.getters['misc/get']('lasthomepage')

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
    },
    play() {
      this.waitForRef('video', async () => {
        try {
          const videoEl = document.querySelector('video')
          videoEl.muted = true
          await videoEl.play()
        } catch (e) {
          console.log('Video play failed', e)
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
  grid-template-columns: 1fr 1.2fr;
  grid-template-rows: 1fr 50px minmax(50px, auto);

  @include media-breakpoint-up(sm) {
    grid-template-columns: 0.4fr 0.6fr;
    grid-template-rows: auto auto auto;
    grid-column-gap: 50px;
    grid-row-gap: 30px;
  }
}

.map {
  grid-row: 2 / 3;
  grid-column: 1 / 3;

  @include media-breakpoint-up(sm) {
    height: 300px;
  }

  @include media-breakpoint-up(lg) {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    // 100vh includes the header and margins etc so they need to be taken off
    height: calc(100vh - 150px);
    max-height: 800px;
  }
}

.info {
  grid-row: 1 / 2;
  grid-column: 1 / 3;
  text-align: center;
  justify-self: center;

  @include media-breakpoint-up(lg) {
    grid-column: 2 / 3;
    text-align: left;
  }
}

.app-download {
  grid-row: 2 / 3;
  grid-column: 1 / 3;
  justify-self: center;

  @include media-breakpoint-up(sm) {
    grid-row: 3 / 4;
  }

  @include media-breakpoint-up(lg) {
    grid-row: 2 / 3;
  }
}

.app-download__image {
  max-height: 25px;

  @include media-breakpoint-up(lg) {
    max-height: 40px;
  }
}

.thefooter {
  grid-row: 3 / 4;
  grid-column: 1 / 3;

  @include media-breakpoint-up(sm) {
    grid-row: 4 / 5;
  }

  @include media-breakpoint-up(lg) {
    grid-row: 3 / 4;
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
</style>
