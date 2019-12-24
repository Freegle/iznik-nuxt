<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Banners
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Freegle has artwork for banners that you can print (either yourselves or professionally) to promote Freegle
            at events, at HWRCs or anywhere else!  If you would like the artwork personalised for your council,
            please email <a href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</a>.
          </p>
          <h3>Landscape banner</h3>
          <p>
            Right click on this link to save the <a href="/councils/BannerHorizontal.pdf">PDF artwork</a>.
          </p>
          <a href="/councils/BannerHorizontal.pdf">
            <b-img fluid src="/councils/BannerHorizontalPreview.png" /></a>
          <h3>Vertical stand banner</h3>
          <p>
            Right click on this link to save the <a href="/councils/BannerVertical.pdf">PDF artwork</a>.
          </p>
          <a href="/councils/BannerVertical.pdf">
            <b-img fluid src="/councils/BannerVerticalPreview.png" /></a>
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
      'Councils - Banners',
      'Freegle has artwork for banners that you can print'
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
