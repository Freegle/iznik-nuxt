<template>
  <div class="layout bg-white">
    <div class="text pl-4 pr-4">
      <h1>
        Got an old {{ item }}?
      </h1>
      <p>
        Do you have an old {{ item }}?  Wondering how to get rid of it without it going into <strong>landfill or
          incinerators</strong>?  Freegle can help!
      </p>
      <p>
        Right now across the UK <strong>{{ messages.length | pluralize(['person is ', 'people are'], { includeNumber: true }) }} freegling</strong> {{ 2 | pluralize(item) }} they don't want any more to people nearby who
        need them.  It's <strong>local</strong>, it's <strong>easy</strong>, it's <strong>fun</strong>, and
        best of all, it's <strong>free</strong>!
      </p>
      <p>
        Just list your {{ item }} with us in a few quick steps, and we'll let people nearby know about it.  They'll get
        in touch, you pick someone to have it, and they'll come round and take it away.
      </p>
      <p>
        You don't need to spend hours on the phone to the council, and you don't have to pay.  So why not make
        someone's day and offer up your old <strong>{{ item }}</strong> today?
      </p>
      <b-btn variant="primary" size="lg" to="/give" class="mt-2 mb-4">
        Give away my {{ item }}
      </b-btn>
    </div>
    <div class="map">
      <ClientOnly>
        <l-map
          ref="map"
          :center="[53.945, -2.5209]"
          style="width: 100%; height: 400px"
          :zoom="5"
          :min-zoom="5"
          :max-zoom="13"
          @ready="ready"
        >
          <l-tile-layer :url="osmtile" :attribution="attribution" />
          <ClusterMarker v-if="showCluster" :markers="messages" :map="mapObject" />
        </l-map>
      </ClientOnly>
    </div>
    <div class="images">
      <RandomImage :images="images" />
    </div>
  </div>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'
import ClusterMarker from '@/components/ClusterMarker'
import waitForRef from '@/mixins/waitForRef'
import RandomImage from '@/components/RandomImage'

function shuffle(array) {
  let counter = array.length

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    counter--
    const temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

export default {
  components: { RandomImage, ClusterMarker },
  mixins: [buildHead, waitForRef],
  data: function() {
    return {
      showCluster: false,
      mapObject: null
    }
  },
  computed: {
    messages() {
      return this.$store.getters['messages/getAll']
    },
    osmtile() {
      return process.env.OSM_TILE
    },
    attribution() {
      return 'Map data &copy; <a href="https://www.openstreetmap.org/" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    },
    images() {
      return this.offers.map(o => o.attachments[0].paththumb)
    }
  },
  async asyncData({ app, params, store }) {
    const offers = []

    if (params.item && params.item.length >= 2) {
      // Look across the whole UK for this item.
      await store.dispatch('messages/clear')
      await store.dispatch('messages/fetchMessages', {
        subaction: 'searchmess',
        search: params.item,
        swlat: 49.959999905,
        swlng: -7.57216793459,
        nelat: 58.6350001085,
        nelng: 1.68153079591,
        exactonly: true
      })

      // Find some OFFERs with photos.
      const messages = store.getters['messages/getAll']
      const shuffled = shuffle(messages)

      for (let i = 0; offers.length < 20 && i < shuffled.length; i++) {
        await store.dispatch('messages/fetch', {
          id: shuffled[i].id,
          summary: true
        })

        const message = store.getters['messages/get'](shuffled[i].id)

        if (
          (message.lat || message.lng) &&
          message.type === 'Offer' &&
          message.attachments &&
          message.attachments.length
        ) {
          offers.push(message)
        }
      }
    }

    return {
      offers: offers
    }
  },
  beforeCreate() {
    this.item = this.$route.params.item
  },
  methods: {
    ready() {
      this.waitForRef('map', () => {
        this.mapObject = this.$refs.map.mapObject
        this.showCluster = true
      })
    }
  },
  head() {
    return this.buildHead(
      this.item
        ? 'What to do with an old ' + this.item
        : 'What to do with old items',
      'Got an old ' +
        this.item +
        '?  Wondering how to get rid of it without it going into landfill or incinerators?  Freegle can help...'
    )
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.layout {
  display: grid;

  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr;

  .text {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
  }

  .map {
    grid-row: 3 / 4;
    grid-column: 1 / 2;
  }

  .images {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
  }

  @include media-breakpoint-up(md) {
    grid-template-rows: auto auto auto;
    grid-template-columns: 1fr;

    .text {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    .map {
      grid-row: 3 / 4;
      grid-column: 1 / 2;
    }

    .images {
      grid-row: 2 / 3;
      grid-column: 1 / 2;
    }
  }

  @include media-breakpoint-up(lg) {
    grid-template-rows: auto auto;
    grid-template-columns: 3fr 2fr;

    .text {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    .map {
      grid-row: 1 / 2;
      grid-column: 2 / 3;
    }

    .images {
      grid-row: 2 / 3;
      grid-column: 1 / 3;
    }
  }
}
</style>
