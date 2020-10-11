<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Posters
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            We have a range of posters available for you to print and use to promote Freegle in your council
            buildings and the wider community.
          </p>
          <ul>
            <li>
              <a target="_blank" href="/posters/A4.jpg">A4 Poster with tear-offs</a> (great for libraries, leisure centres and other council-owned buildings).
              Also available in <a target="_blank" href="/posters/A4Welsh.jpg">Welsh</a>.
            </li>
            <li>
              <a target="_blank" href="/posters/A5.jpg">A5 Poster with tear-offs</a>.
              Also available in <a target="_blank" href="/posters/A5Welsh.jpg">Welsh</a>.
            </li>
            <li><a target="_blank" href="/councils/PosterA5Space.png">A5 poster with space for council logo</a></li>
          </ul>

          <p>
            Ideas for places to display posters:
          </p>
          <ul>
            <li>Household Waste Recycling Centres</li>
            <li>Council staff kitchens/communal areas</li>
            <li>Noticeboards (Parish councils, cafes, charity shops, food shops, anywhere!)</li>
            <li>Schools</li>
            <li>Libraries</li>
            <li>Nurseries</li>
            <li>Hospitals</li>
            <li>Leisure centres</li>
            <li>Cafes</li>
          </ul>
        </b-card-text>
      </b-card>
    </b-col>
    <b-col>
      <CouncilsContent />
    </b-col>
  </b-row>
</template>
<script>
import CouncilsContent from '../../components/CouncilsContent'
import buildHead from '@/mixins/buildHead.js'
import sectionScroll from '@/mixins/sectionScroll.js'

export default {
  components: { CouncilsContent },
  mixins: [buildHead, sectionScroll],
  head() {
    return this.buildHead(
      'Councils - Posters',
      'We have a range of posters available for you to print and use'
    )
  }
}
</script>
<style scoped>
.anchor {
  display: block;
  position: relative;
  top: -68px;
  visibility: hidden;
}
</style>
