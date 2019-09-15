<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != $store.state.auth.user.id" class="media">
          <b-card border-variant="success">
            <b-card-title>
              <h4>{{ otheruser.displayname }} sent an address:</h4>
            </b-card-title>
            <b-card-text>
              <b-row>
                <b-col cols="12" md="8">
                  <pre v-if="chatmessage.address.id" :class="chatmessage.address.instructions ? '' : 'mb-2'">{{ chatmessage.address.multiline }}</pre><pre v-else>This address has been deleted.</pre>
                  <hr v-if="chatmessage.address.instructions">
                  <div v-if="chatmessage.address.instructions" class="mb-2">
                    {{ chatmessage.address.instructions }}
                  </div>
                </b-col>
                <b-col cols="12" md="4" style="margin-top:-30px">
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
                <b-col cols="12" md="8">
                  <pre v-if="chatmessage.address.id" :class="chatmessage.address.instructions ? '' : 'mb-2'">{{ chatmessage.address.multiline }}</pre><pre v-else>This address has been deleted.</pre>
                  <hr v-if="chatmessage.address.instructions">
                  <div v-if="chatmessage.address.instructions" class="mb-2">
                    {{ chatmessage.address.instructions }}
                  </div>
                </b-col>
                <b-col cols="12" md="4" style="margin-top:-30px">
                  <b-embed type="iframe" aspect="1by1" allowfullscreen :src="'https://www.google.com/maps/embed/v1/place?key=AIzaSyArVxoX781qdcbmQZi1PKHX-qa0bPbboH4&q=' + chatmessage.address.postcode.lat + ',' + chatmessage.address.postcode.lng" />
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </div>
  </b-col>
  </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
// TODO Unpromise button
import ChatBase from '~/components/ChatBase'

export default {
  extends: ChatBase
}
</script>
