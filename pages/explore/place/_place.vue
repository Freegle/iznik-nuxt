<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1" />
      <b-col cols="12" lg="6" class="p-0">
        <div>
          <h1 class="d-none d-sm-block heading">
            Freegling near {{ placeName }}
          </h1>
          <client-only>
            <div :style="mapHeight" class="position-relative mb-1">
              <div class="mapbox">
                <PostMap
                  v-if="initialBounds"
                  :initial-bounds="initialBounds"
                  :height-fraction="heightFraction"
                  @messages="messagesChanged($event)"
                  @groups="groupsChanged($event)"
                  @centre="centreChanged($event)"
                />
                <div v-else :style="mapHeight" />
              </div>
              <Postcode v-if="filteredMessages && filteredMessages.length && false" :value="postcode" size="md" class="mt-2 postcode" @selected="selected($event)" />
            </div>
          </client-only>
          <div class="rest">
            <div v-if="closestGroups.length" class="d-flex flex-wrap mb-1 justify-content-between border p-2 bg-white">
              <b-btn
                v-for="group in closestGroups"
                :key="'group-' + group.id"
                size="md"
                :to="'/explore/join/' + group.id"
                variant="primary"
                class="mb-1"
              >
                Join {{ group.namedisplay }}
              </b-btn>
            </div>
            <div v-if="filteredMessages && filteredMessages.length">
              <div v-for="message in filteredMessages" :key="'messagelist-' + message.id" class="p-0">
                <Message v-bind="message" />
              </div>
            </div>
            <client-only>
              <infinite-loading
                v-if="initialBounds"
                :identifier="infiniteId"
                force-use-infinite-wrapper="body"
                :distance="distance"
                @infinite="loadMore"
              >
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </span>
              </infinite-loading>
            </client-only>
          </div>
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1" />
    </b-row>
  </b-container>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import adaptiveMap from '../../../mixins/adaptiveMap'
import Postcode from '../../../components/Postcode'
import buildHead from '@/mixins/buildHead.js'
const Message = () => import('~/components/Message.vue')
const PostMap = () => import('~/components/PostMap')

export default {
  components: {
    Postcode,
    InfiniteLoading,
    Message,
    PostMap
  },
  mixins: [adaptiveMap, buildHead],
  created() {
    this.postcode = this.$route.params.postcode
  },
  async mounted() {
    // Ensure we have no cached messages for other searches/groups
    this.$store.dispatch('messages/clear')
    this.context = null

    if (this.postcode) {
      // Find the groups near this postcode.
      await this.$store.dispatch('locations/fetch', {
        typeahead: this.postcode,
        postcount: true,
        groupareas: true
      })

      const groups = []

      const list = Object.values(this.$store.getters['locations/list'])
      const l = list[0]
      l.groupsnear.forEach(g => {
        groups.push(g)
      })

      this.setInitialBounds(
        l.lat,
        l.lng,
        this.swlat === null ? l.lat : Math.min(this.swlat, l.lat),
        this.swlng === null ? l.lng : Math.min(this.swlng, l.lng),
        this.nelat === null ? l.lat : Math.max(this.nelat, l.lat),
        this.nelng === null ? l.lng : Math.max(this.nelng, l.lng),
        groups
      )
    }
  },
  head() {
    return this.buildHead(
      'Explore Freegle',
      "There are lots of lovely communities of freeglers across the UK. Shall we see what they're up to?",
      null
    )
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.mapbox {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0;
  border: 1px solid $color-gray--light;
}

.postcode {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 20000;
}

.heading {
}

.rest {
}
</style>
