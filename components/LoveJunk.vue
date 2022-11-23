<template>
  <div v-observe-visibility="visible">
    <div v-if="show && heavy" class="d-flex justify-content-around height">
      <div class="heavy clickme" @click="click">
        <div class="bg">
          <b-img src="/lovejunk/personalised1.png" />
        </div>
        <div class="fg">
          <b-img
            rounded
            class="attachment p-0 fg"
            generator-unable-to-provide-required-alt=""
            title="Item picture"
            :src="heavy.attachments[0].path"
            itemprop="image"
            @error.native="brokenImage"
            @click.native="$emit('zoom')"
          />
        </div>
      </div>
    </div>
    <div v-else-if="src && show">
      <div class="d-flex justify-content-around">
        <a @click="click">
          <b-card-img :src="src" fluid class="clickme chosen" />
        </a>
      </div>
    </div>
    <div id="adnotice" class="d-flex justify-content-around text-muted small">
      Advertisement. Why am I seeing this?
    </div>
    <b-tooltip target="adnotice" class="d-none d-md-block">
      Showing this generates a bit of income for Freegle, which helps us keep going.
    </b-tooltip>
  </div>
</template>
<script>
import turfpoint from 'turf-point'
import turfpolygon from 'turf-polygon'
import turfbooleanPointInPolygon from '@turf/boolean-point-in-polygon'
import VueObserveVisibility from 'vue-observe-visibility'
import Vue from 'vue'

if (process.client) {
  Vue.use(VueObserveVisibility)
}

export default {
  props: {
    variant: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      shown: false,
      chosen: null,
      uid: 'lovejunk7',
      heavy: null
    }
  },
  computed: {
    key() {
      // return this.uid + '-' + this.variant
      // No desktop/mobile variants when testing the personalised one.
      return this.uid
    },
    src() {
      return this.chosen
        ? 'https://www.ilovefreegle.org/lovejunk/' + this.chosen
        : null
    },
    show() {
      // We want to show the ad if the user's location is within the area LoveJunk cover.
      if (this.me && (this.me.lat || this.me.lng)) {
        // const point = turfpoint([-0.1281, 51.508])
        const point = turfpoint([this.me.lng, this.me.lat])

        const poly = turfpolygon([
          [
            [-1.2812470495955797, 50.79870927],
            [-0.600094706, 50.62478988],
            [1.069827169, 50.83688497],
            [1.750979513, 51.34749096],
            [2.009158224, 52.4925433],
            [1.50378713, 53.03103532],
            [0.031619161, 54.2938272],
            [-1.248288065, 55.25069175],
            [-1.742672831, 55.12054143],
            [-2.204098612, 54.97735749],
            [-2.569394022, 55.05452015],
            [-2.967648417, 55.03721085],
            [-3.313717753, 54.91741478],
            [-3.9179658, 54.54632061],
            [-3.451988868, 53.58683705],
            [-3.083946876, 53.04868219],
            [-2.934951494, 52.68058414],
            [-2.970657061, 52.43679703],
            [-2.770156572, 52.24549994],
            [-2.586135576, 52.23984074],
            [-2.435073564, 52.13988298],
            [-2.462539385, 51.89309389],
            [-2.575149248, 51.77598663],
            [-2.693252275, 51.69604348],
            [-2.995376299, 51.39199683],
            [-3.058547686, 51.29935605],
            [-2.923965166, 51.23405209],
            [-2.566909502, 51.14109205],
            [-2.318343828, 51.16607196],
            [-2.292251299, 51.14798441],
            [-2.036132524, 50.93254421],
            [-1.994247148, 50.75781967],
            [-1.924209307, 50.67521626],
            [-1.572646807, 50.72218763],
            [-1.28124705, 50.798709274843795],
            [-1.2812470495955797, 50.79870927]
          ]
        ])

        return turfbooleanPointInPolygon(point, poly)
      }

      return false
    }
  },
  methods: {
    async visible() {
      if (!this.shown) {
        this.shown = true

        if (this.me) {
          try {
            // Get our messages.  Don't put them in the store so as not to confuse other pages.
            const { messages } = await this.$api.message.fetchMessages({
              collection: 'AllUser',
              summary: true,
              types: ['Offer', 'Wanted'],
              fromuser: this.myid,
              context: this.context,
              limit: 15
            })

            // Loop through messages
            for (let i = 0; i < messages.length; i++) {
              const message = messages[i]

              // Find a message with a photo which is still open and has a significant weight.
              if (
                !message.outcomes?.length &&
                message.attachments?.length > 0 &&
                message.item.approxweight > 10 &&
                message.type === 'Offer'
              ) {
                this.heavy = message
                this.chosen = 'personalised'
                break
              }
            }
          } catch (e) {}
        }

        if (!this.chosen) {
          const ret = await this.$api.bandit.choose({
            uid: this.key
          })

          if (ret.variant) {
            this.chosen = ret.variant
            this.heavy = null
          }
        }

        if (this.chosen) {
          this.$api.bandit.shown({
            uid: this.key,
            variant: this.chosen
          })
        }

        this.$emit('update:shown', true)
      }
    },
    async click() {
      await this.$api.bandit.chosen({
        uid: this.key,
        variant: this.chosen
      })

      window.open('https://www.lovejunk.com/rubbish-clearance/')
    }
  }
}
</script>
<style scoped lang="scss">
.height {
  min-height: 200px;
}

.heavy {
  display: grid;
  grid-template-rows: 200px;

  .bg {
    z-index: 1000;
    grid-row: 1 / 2;
    grid-column: 1 / 2;

    img {
      max-height: 200px;
      min-height: 200px;
      max-width: 402px;
      min-width: 402px;
    }
  }

  .fg {
    z-index: 1001;
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    padding-right: calc((100% - 402px) / 2);

    img {
      margin-left: 18px;
      margin-top: 20px;
      margin-bottom: 20px;
      max-height: 160px;
      object-fit: cover;
    }
  }
}

.chosen {
  max-height: 200px;
  min-height: 200px;
}
</style>
