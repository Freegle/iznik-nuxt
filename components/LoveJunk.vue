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
            @error="brokenImage"
            @click="$emit('zoom')"
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
    <div v-b-tooltip title="Showing this generates a bit of income for Freegle, which helps us keep going." class="d-flex justify-content-around text-muted small">
      Advertisement. Why am I seeing this?
    </div>
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
            [1.657075361075404, 51.174624729331576],
            [0.2618116892004041, 50.606355544198884],
            [-1.320219560799596, 50.77339608215756],
            [-2.144194170174596, 50.529596449427125],
            [-4.187651201424596, 49.88270729212417],
            [-6.438227592997438, 49.99583988669229],
            [-5.141840874247438, 52.5250112346936],
            [-4.680415092997438, 53.65971152061652],
            [-3.6257275929974386, 54.28007506151829],
            [-5.251704155497438, 54.612258862017526],
            [-5.325524820633545, 55.12495274929916],
            [-4.882988063894631, 55.50068948348672],
            [-5.069755642019631, 56.021098084776476],
            [-2.619804470144631, 56.41510894014642],
            [-1.587089626394631, 55.90425943747721],
            [0.038886936105368974, 54.41033957700683],
            [2.016425998605369, 52.70073063277417],
            [1.657075361075404, 51.174624729331576]
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
    },
    brokenImage(event) {
      event.target.src = require('~/static/placeholder.jpg')
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
      min-height: 160px;
      max-height: 160px;
      object-fit: cover;
      min-width: 144px;
      max-width: 144px;
    }
  }
}

.chosen {
  max-height: 200px;
  min-height: 200px;
}
</style>
