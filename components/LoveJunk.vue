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
            class="d-none d-md-block attachment p-0 fg"
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
    <b-tooltip target="adnotice">
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
            [-2.2943362968241687, 51.26204661647619],
            [-2.2998294608866687, 51.03461804727391],
            [-1.7505130546366687, 50.705289000506696],
            [-1.2671146171366687, 50.78870761968408],
            [-0.6408939140116687, 50.67396869213004],
            [0.5746745224084115, 50.715724456901704],
            [1.5579508895959115, 51.17258732297439],
            [1.5140055770959115, 51.46440601215102],
            [1.8292478587618266, 52.577773457481676],
            [1.6919187571993266, 52.9003754112931],
            [0.6537107493868266, 53.05252809496457],
            [0.0989011790743266, 53.59715520639182],
            [-0.3680177662381734, 53.74359914740484],
            [-1.5049596118332365, 53.61345189624612],
            [-2.0597691821457365, 53.63951352183381],
            [-1.8345494555832365, 53.92836480314418],
            [-2.0707555102707365, 54.125194463200536],
            [-2.8782506274582365, 54.12197525556005],
            [-3.2847447680832365, 53.58411332654193],
            [-3.1584019946457365, 53.212937092659566],
            [-2.7903600024582365, 52.84292227421844],
            [-2.9853673266769865, 52.40945221621469],
            [-2.7848668383957365, 52.40274988816456],
            [-2.4992223071457365, 52.150016457446384],
            [-2.4113316821457365, 51.825263447218155],
            [-2.6969762133957365, 51.58356488128554],
            [-3.0485387133957365, 51.33910159407639],
            [-2.8343053149582365, 51.21195522653396],
            [-2.2943362968241687, 51.26204661647619]
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
                message.item.approxweight > 10
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
