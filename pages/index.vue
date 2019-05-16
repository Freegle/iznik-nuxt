<template>
  <div class="pl-3">
    <b-row>
      <b-col>
        <h1>Next Steps for Freegle</h1>
        <div>
          <img class="float-left rounded-circle small img-thumbnail mr-4 mb-4" src="~/static/edward.jpg" alt="Photo of Edward">
          <p>
            I'm Edward, and I'm doing a sponsored walk for Freegle.  I put my heart and soul into Freegle, including
            developing the website (so yeah, blame me).  I just love all the acts of kindness from freeglers making
            the world a bit better each day.
          </p>
        </div>
        <p>
          Now it's time to put my hurt and sole into Freegle.  I'm starting on May 14th, from the southernmost point of
          the UK (the Lizard) to the easternmost (Lowestoft Ness).  Scroll down for my route.
        </p>
      </b-col>
    </b-row>
    <b-row cols="12" lg="6">
      <b-col>
        <b-card>
          <b-card-title>
            {{ sponsorCount }} miles sponsored, {{ thermMax - sponsorCount }} miles to go, &pound;{{ total }} raised
          </b-card-title>
          <b-card-body>
            <b-row>
              <b-col cols="8">
                <p>
                  1 donation (of any amount) = 1 mile sponsored
                </p>
                <b-form-group
                  id="fieldset-1"
                  description="This name will appear on the map.  If you want to be anonymous, leave it blank or make up something silly."
                >
                  <b-form-input v-model="sponsorName" v-focus placeholder="Name your mile" trim />
                </b-form-group>
                <b-btn
                  size="lg"
                  variant="info"
                  @click="sponsorClick"
                >
                  <b-img
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                    title="PayPal - The safer, easier way to pay online!"
                    alt="Donate with PayPal button"
                    class="float-left"
                    rounded
                  />&nbsp;Sponsor me!
                </b-btn>
                <p>Other ways to donate <a href="https://ilovefreegle.org/donate">here</a>.</p>
              </b-col>
              <b-col cols="4">
                <vue-thermometer
                  :value="sponsorCount"
                  :min="0"
                  :max="thermMax"
                  scale=" miles"
                  :options="thermOptions"
                />
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
        <p class="pt-1">
          Here's my route.  Zoom right in to see where I am each night and who's sponsored each mile.
          The blue part isn't sponsored yet; the green part is.
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
            <div slot="visible">
              <div style="top: 5px; left: 40%; width: calc(100% - 100px); position: absolute; z-index: 100" class="rounded">
                <GmapAutocomplete
                  placeholder="Search for a place"
                  @place_changed="gotoPlace"
                />
              </div>
            </div>

            <gmap-polyline :path.sync="routeSponsored" :options="{ strokeColor:'#008000'}" />
            <gmap-polyline :path.sync="routeUnsponsored" :options="{ strokeColor:'darkblue'}" />
            <div v-if="currentZoom >= 14" :key="'sponsor-' + currentZoom">
              <SponsorMarker v-for="(m,i) in sponsorLocs" :key="'sponsormarker-' + i" :marker="m" />
            </div>
            <div v-if="currentZoom >= 9" :key="'nights-' + currentZoom">
              <NightMarker v-for="(m,i) in nights" :key="'nightmarker-' + i + '-' + currentZoom" :marker="m" :current-zoom="currentZoom" />
            </div>
          </GmapMap>
        </no-ssr>
        <p>
          If you're near my route and fancy meeting up, then I'd love that - it's always nice to meet other freeglers and
          have someone to chat to over my umpteenth veggie lasagne.  Walking company is good too.  Keep zooming into the map until
          you see where I expect to be on different nights, then drop me a line at
          <a href="mailto:edward@ehibbert.org.uk">edward@ehibbert.org.uk</a>.
        </p>
        <b-btn size="lg" variant="success" @click="email">
          <fa icon="envelope" />&nbsp;Get in touch
        </b-btn>
      </b-col>
      <b-col cols="12" lg="6">
        <b-row>
          <b-col>
            <b-card>
              <b-card-title>
                There's a blog
              </b-card-title>
              <b-card-body>
                <p>Please like the Facebook page, or if you don't do Facebook, find it <a href="https://medium.com/@edwardhibbert" target="_blank">on Medium</a>.</p>
                <no-ssr>
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnextstepsforfreegle&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=219434218079616"
                    width="340"
                    height="500"
                    style="border:none;overflow:hidden"
                    scrolling="no"
                    frameborder="0"
                    allowTransparency="true"
                    allow="encrypted-media"
                  />
                </no-ssr>
              </b-card-body>
            </b-card>
            <b-card>
              <b-card-body>
                <h3>
                  Sponsors
                </h3>
                <p>Here are the people who have kindly sponsored me.</p>
                <ul class="list-unstyled">
                  <li v-for="(s, i) in sponsorsRecentFirst" :key="'sponsor-' + i">
                    <span class="text-muted">{{ s.timestamp | timeago }}</span> {{ s.name }}
                  </li>
                </ul>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import SponsorMarker from '../components/SponsorMarker'
import NightMarker from '../components/NightMarker'
import strollMap from '~/static/strollmap.png'

export default {
  head() {
    return {
      title: 'Sponsor a Mile!',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            "I'm putting my hurt and sole into Freegle by doing a sponsored walk this summer - to help Freegle take its next steps."
        },
        {
          hid: `og:title`,
          name: 'og:title',
          content: 'Sponsor a Mile!'
        },
        {
          hid: `og:description`,
          name: 'og:description',
          content:
            "I'm putting my hurt and sole into Freegle by doing a sponsored walk this summer - to help Freegle take its next steps."
        },
        {
          hid: `og:image`,
          name: 'og:image',
          content: strollMap
        },
        {
          hid: `og:url`,
          name: 'og:url',
          content: 'https://sponsoramile.ilovefreegle.org'
        },
        {
          hid: `twitter:card`,
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ]
    }
  },

  components: { SponsorMarker, NightMarker },

  data() {
    return {
      center: { lat: 55.915655, lng: -4.744502 },
      currentZoom: 1,
      zoom: 12,
      route: [],
      sponsors: [],
      nights: [],
      thermOptions: {
        thermo: {
          color: '#008000',
          ticksEnabled: false
        }
      },
      infoContent: '',
      infoWindowPos: null,
      infoWinOpen: false,
      sponsorName: null
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
    const nights = store.getters['stroll/nights']

    return {
      center: { lat: 55.915655, lng: -4.744502 },
      zoom: 12,
      route: route,
      sponsors: sponsors,
      nights: nights,
      total: store.getters['stroll/total']
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
    },

    gotoPlace(place) {
      this.$refs.mymap.$mapObject.setCenter(place.geometry.location)
      this.$refs.mymap.$mapObject.fitBounds(place.geometry.viewport)
    },

    async sponsorClick() {
      console.log('Sponsor click', this.sponsorName)
      window.open('https://freegle.in/strollfundraiser', '_blank')
      await this.$store.dispatch('stroll/sponsor', {
        sponsorName: this.sponsorName
      })
      await this.$store.dispatch('stroll/fetch')
      this.sponsors = this.$store.getters['stroll/sponsors']
    }
  }
}
</script>
