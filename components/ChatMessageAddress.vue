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
              <b-row>
                <b-col>
                  <b-embed type="iframe" aspect="1by1" allowfullscreen :src="'https://www.google.com/maps/embed/v1/place?key=AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4&q=' + chatmessage.address.postcode.lat + ',' + chatmessage.address.postcode.lng" />
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
              <b-row>
                <b-col>
                  <b-embed type="iframe" aspect="1by1" allowfullscreen :src="'https://www.google.com/maps/embed/v1/place?key=AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4&q=' + chatmessage.address.postcode.lat + ',' + chatmessage.address.postcode.lng" />
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
import ChatBase from '~/components/ChatBase'

export default {
  extends: ChatBase
}
</script>
<style scoped>
</style>
