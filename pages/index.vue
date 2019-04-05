<template>
  <b-row>
    <b-col cols="12" lg="6">
      <h1>Next Steps for Freegle</h1>
      <p>
        I'm Edward, and I'm doing a sponsored walk for Freegle.  I put my heart and soul into Freegle, including
        developing the website (so yeah, blame me).  I just love all the acts of kindness from freeglers making
        the world a bit better each day.
      </p>
      <p>
        Now it's time to put my hurt and sole into Freegle.  I'm starting on May 14th, from the southernmost point of
        the UK (the Lizard) to the easternmost (Lowestoft Ness).  Here's my route - zoom in for details.
      </p>
      <no-ssr placeholder="Map loading...">
        <GmapMap
          ref="mymap"
          :center="center"
          :zoom="7"
          map-type-id="terrain"
          style="width:100%; height: 400px;"
          @zoom_changed="zoomChanged"
        >
          <gmap-polyline :path.sync="routeSponsored" :options="{ strokeColor:'#008000'}" />
          <gmap-polyline :path.sync="routeUnsponsored" :options="{ strokeColor:'darkblue'}" />
          <div v-if="currentZoom >= 14" :key="'zoom-' + currentZoom">
            <SponsorMarker v-for="(m,i) in sponsorLocs" :key="'sponsormarker-' + i" :marker="m" />
          </div>
        </GmapMap>
      </no-ssr>
      <p>
        If you're near my route and fancy meeting up, then I'd love that - it's always nice to meet other freeglers and
        have someone to chat to over my umpteenth veggie lasagne.  Zoom into the map to see where I am on different
        dates, then drop me a line at <a href="mailto:edward@ehibbert.org.uk">edward@ehibbert.org.uk</a>.
      </p>
      <b-btn size="lg" variant="success" @click="email">
        <fa icon="envelope" />&nbsp;Get in touch
      </b-btn>
    </b-col>
    <b-col cols="12" lg="6">
      <b-row>
        <b-col cols="8">
          <h1>Sponsor Me?</h1>
          <p>
            1 donation = 1 mile sponsored.
          </p>
          <p>
            If you share your name and email when donating then I'll mention you in the blog, and try to take
            a picture of something interesting during your mile.
          </p>
          <h3>Miles sponsored: {{ sponsorCount }} raising &pound;{{ raised }}.</h3>
          <h5>That leaves {{ thermMax - sponsorCount }} miles to go...</h5>
          <p class="text-muted">
            The blue part of the route on the map isn't sponsored yet; the green is.
          </p>
          <a target="_blank" rel="noopener" data-realurl="true" href="https://freegle.in/paypalfundraiser" class="js-clickdonate hidden-xs">
            <span class="btn btn-lg btn-info">
              <b-img
                src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"
                class="float-left"
                rounded
              />&nbsp;Sponsor me!
            </span>
          </a>
          <h3 class="pt-2">
            Blog
          </h3>
          <p>
            I'm blogging about this - you can follow me.
          </p>
          <p>
            <a href="https://medium.com/@edwardhibbert" target="_blank">
              <b-btn variant="primary">
                View Blog
              </b-btn>
            </a>
          </p>
          <h3>
            Sponsors
          </h3>
          <ul class="list-unstyled">
            <li v-for="(s, i) in sponsorsRecentFirst" :key="'sponsor-' + i">
              <span class="text-muted">{{ s.timestamp | timeago }}</span> {{ s.name }} &pound;{{ s.amount }}
            </li>
          </ul>
        </b-col>
        <b-col cols="4" class="pt-5">
          <vue-thermometer
            :value="sponsorCount"
            :min="0"
            :max="thermMax"
            scale=" miles"
            :options="thermOptions"
          />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import SponsorMarker from '../components/SponsorMarker'

export default {
  head() {
    return {
      title: 'Sponsor a Mile!',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            "I'm doing a sponsored walk for Freegle this summer.  Which mile will you sponsor?"
        }
      ]
    }
  },

  components: { SponsorMarker },

  data() {
    return {
      center: { lat: 55.915655, lng: -4.744502 },
      currentZoom: 12,
      zoom: 12,
      route: [],
      sponsors: [],
      thermOptions: {
        thermo: {
          color: '#008000'
        }
      },
      infoContent: '',
      infoWindowPos: null,
      infoWinOpen: false
    }
  },
  computed: {
    sponsorCount() {
      return this.sponsors.length
    },
    sponsorsRecentFirst() {
      const s = cloneDeep(this.sponsors)
      return s.reverse()
    },
    raised() {
      let sum = 0
      for (const sponsor of this.sponsors) {
        sum += sponsor.amount
      }

      return sum
    },
    routeSponsored() {
      let dist = 0
      const ret = []

      for (const marker of this.route) {
        ret.push(marker)
        dist += marker.fromlast

        if (dist > this.sponsors.length) {
          break
        }
      }

      return ret
    },
    routeUnsponsored() {
      let dist = 0
      const ret = []

      for (const marker of this.route) {
        dist += marker.fromlast

        if (dist > this.sponsors.length) {
          ret.push(marker)
        }
      }

      return ret
    },
    sponsorLocs() {
      let currspon = 0
      let dist = 0
      let lastmarker = null
      const ret = []

      for (const marker of this.route) {
        if (Math.round(dist - 0.5) < Math.round(dist + marker.fromlast - 0.5)) {
          ret.push({
            sponsor: this.sponsors[currspon],
            position: {
              lat: lastmarker.lat,
              lng: lastmarker.lng
            }
          })

          // New sponsor
          currspon++
        }

        dist += marker.fromlast

        if (dist > this.sponsors.length) {
          break
        }

        lastmarker = marker
      }

      return ret
    },

    thermMax() {
      let dist = 0
      for (const marker of this.route) {
        dist += marker.fromlast
      }

      return Math.round(dist / 10) * 10 + 10
    }
  },

  async asyncData({ app, params, store }) {
    await store.dispatch('stroll/fetch')

    const route = store.getters['stroll/route']
    const sponsors = store.getters['stroll/sponsors']

    return {
      center: { lat: 55.915655, lng: -4.744502 },
      zoom: 12,
      route: route,
      sponsors: sponsors
    }
  },

  mounted() {
    this.setBounds()
  },

  methods: {
    email: function() {
      window.location = 'mailto:edward@ehibbert.org.uk'
    },

    setBounds: function() {
      if (this.$refs.mymap) {
        // set bounds of the map
        this.$refs.mymap.$mapPromise.then(map => {
          const bounds = new window.google.maps.LatLngBounds()
          for (const marker of this.route) {
            const myLatLng = new window.google.maps.LatLng({
              lat: marker.lat,
              lng: marker.lng
            })
            bounds.extend(myLatLng)
          }
          map.fitBounds(bounds)
        })
      } else {
        window.setTimeout(this.setBounds, 100)
      }
    },

    showSponsor: function(marker, idx) {
      this.infoWindowPos = marker.position
      this.infoContent = marker.infoText

      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      }
      // if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    },

    zoomChanged: function(zoom) {
      this.currentZoom = zoom
    }
  }
}
</script>
