<template>
  <div>
    <b-row class="pb-1">
      <b-col cols="12" sm="6" :offset-sm="chatmessage.userid != myid ? 0 : 6">
        <div v-if="chatmessage.userid != myid" class="media">
          <b-card border-variant="success">
            <b-card-title>
              <h4>{{ otheruser.displayname }} sent an address:</h4>
            </b-card-title>
            <b-card-text>
              <b-row>
                <b-col>
                  <pre v-if="chatmessage.address.id" :class="chatmessage.address.instructions ? '' : 'mb-2'">{{ chatmessage.address.multiline }}</pre><pre v-else>This address has been deleted.</pre>
                  <hr v-if="chatmessage.address.instructions">
                  <div v-if="chatmessage.address.instructions" class="mb-2">
                    {{ chatmessage.address.instructions }}
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="chatmessage.address && chatmessage.address.postcode">
                <b-col>
                  <l-map
                    ref="map"
                    :zoom="16"
                    :center="[chatmessage.address.postcode.lat, chatmessage.address.postcode.lng]"
                    :style="'width: 100%; height: 200px'"
                  >
                    <l-tile-layer :url="osmtile" :attribution="attribution" />
                    <l-marker :lat-lng="[chatmessage.address.postcode.lat, chatmessage.address.postcode.lng]" :interactive="false" />
                  </l-map>
                  <ExternalLink :href="'https://maps.google.com/?q=' + chatmessage.address.postcode.lat + ',' + chatmessage.address.postcode.lng + '&z=16'" class="mt-1">
                    View in Google Maps
                  </ExternalLink>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </div>
        <div v-else class="media float-right">
          <b-card border-variant="success">
            <b-card-title>
              <h4>You sent an address:</h4>
            </b-card-title>
            <b-card-text>
              <b-row>
                <b-col cols="12">
                  <pre v-if="chatmessage.address.id" :class="chatmessage.address.instructions ? '' : 'mb-2'">{{ chatmessage.address.multiline }}</pre><pre v-else>This address has been deleted.</pre>
                  <hr v-if="chatmessage.address.instructions">
                  <div v-if="chatmessage.address.instructions" class="mb-2">
                    {{ chatmessage.address.instructions }}
                  </div>
                </b-col>
              </b-row>
              <b-row v-if="chatmessage.address && chatmessage.address.postcode">
                <b-col>
                  <l-map
                    ref="map"
                    :zoom="14"
                    :center="[chatmessage.address.postcode.lat, chatmessage.address.postcode.lng]"
                    :style="'width: 100%; height: 200px'"
                  >
                    <l-tile-layer :url="osmtile" :attribution="attribution" />
                    <l-marker :lat-lng="[chatmessage.address.postcode.lat, chatmessage.address.postcode.lng]" :interactive="false" />
                  </l-map>
                  <ExternalLink :href="'https://maps.google.com/?q=' + chatmessage.address.postcode.lat + ',' + chatmessage.address.postcode.lng + '&z=16'" class="mt-1">
                    View in Google Maps
                  </ExternalLink>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import ExternalLink from './ExternalLink'
import ChatBase from '~/components/ChatBase'
import map from '@/mixins/map.js'

export default {
  components: { ExternalLink },
  extends: ChatBase,
  mixins: [map]
}
</script>
<style scoped>
</style>
