<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Other Councils
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <h3>Oxfordshire Reuses Event</h3>
          <p>
            On June 16th 2019 Oxfordshire councils working in partnership took over Oxford Town Hall for a
            zero-waste festival. Highlights included a swap shop, repair café, clothes upcycling demo,
            children’s upcycling workshop, surplus food café, stalls (including Freegle) and Freegle’s Cat Fletcher was
            there to open the event as well as give two talks about Freegle and her portfolio of work on reuse,
            including her role as Reuse Manager for Brighton and Hove City Council.
          </p>
          <p>
            The event was a great success with around 650kg of items swapped or repaired.
          </p>
          <p>
            <i>&quot;Thank you so much once again for your involvement, it’s made such a huge difference and wonderfully raised the profile of the event!&quot;</i> Alexandra Mates, Recycling Promotions Officer for Oxford Direct Services.
          </p>
          <p>
            <i>&quot;Thank you for all your help with our Oxfordshire Reuses event, it was a huge success and having Cat
              there was fantastic. Her talk was really inspirational and it was amazing to hear about all the
              great work she has done so thank you for helping us get her there!&quot;</i>Becky Kenton Lake, Waste Strategy Projects Officer, Oxfordshire County Council.
          </p>
          <div class="row">
            <div class="col-sm-6">
              <b-img fluid src="/councils/OxfordshireReusesEvent1.jpg" />
            </div>
            <div class="col-sm-6">
              <b-img fluid src="/councils/OxfordshireReusesEvent3.jpg" />
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <b-img fluid src="/councils/OxfordshireReusesEvent4.jpg" />
            </div>
            <div class="col-sm-6">
              <b-img fluid src="/councils/OxfordshireReusesEvent5.jpg" />
            </div>
          </div>
          <h3>
            Cumbria County Council’s partnership working with Freegle
          </h3>
          <p>
            Penrith and Eden Freegle has been working successfully with Cumbria County Council for many years and in
            2015 were together shortlisted for a National Recycling Award.  An interesting summary of their work can
            be found
            <a href="https://www.penrithedenfreegle.org.uk/2017-02-27-freegle-partnership-cumbria-county-council" target="_blank">here</a>
            and a detailed case study will be available soon.
          </p>
          <h3>Social media</h3>
          <p>
            Essex regularly run social media campaigns featuring Freegle, here is an example:
            <b-img fluid src="/councils/EssexFacebook.png" />
          </p>
          <h3>Websites</h3>
          <p>
            The Love Essex website has a dedicated
            <a href="http://www.loveessex.org/news-and-ideas/have-items-you-no-longer-want-freegle-can-help/" target="_blank">Freegle page</a>
            which you could replicate for your council.
          </p>

          <h3>Leaflets</h3>
          <p>This double-sided A5 publicity leaflet designed by Freegle volunteers in Cumbria can be copied and edited in Canva.com:</p>
          <p>
            <a href="https://www.canva.com/design/DAB4sdNw7yA/crZcKPhzyEH3Yfz0ZaGdxg/view" target="_blank">
              https://www.canva.com/design/DAB4sdNw7yA/crZcKPhzyEH3Yfz0ZaGdxg/view
            </a>
          </p><p>
            The Penrith &amp; Eden Freegle website in part of Cumbria has newsletters and articles which can be used as templates by for other councils.
            <a href="https://www.penrithedenfreegle.org.uk/" target="_blank">https://www.penrithedenfreegle.org.uk/</a>
          </p>

          <h3>Posters</h3>
          <p>Essex County Council produced these posters </p>
          <b-img fluid src="/councils/EssexAdvert1.PNG" />

          <h3>Local magazine articles</h3>
          <p>Cumbria County Council has featured Freegle in its Your Cumbria magazine for households</p>
          <a href="/councils/Freegle-in-Your-Cumbria-2015.png" target="_blank">
            <b-img fluid src="/councils/Freegle-in-Your-Cumbria-2015.png" />
          </a>

          <h3>Give and Take Day publicity</h3>
          <p>
            Penrith and Eden Freegle in partnership with Cumbria County Council regularly run Give and Take days –
            <a href="/councils/Freegle%20Shap%20011016%20press%20release.doc">
              here is one of their press releases</a>
            which you can use and adapt for similar events you might run.
          </p>

          <p>
            Penrith and Eden Freegle in partnership with Cumbria County Council have
            produced leaflets for their
            regular ‘Give and Take’ events which can be used as templates by other councils:
          </p>

          <a href="/councils/CumbriaLeaflet.png" target="_blank">
            <b-img fluid src="/councils/CumbriaLeaflet.png" /></a>

          <h3>Videos</h3>
          <p>
            Essex and Cumbria County Councils have produced a series of videos showing residents how to make best use
            of Freegle.  You can find these in our <a href="/councils/photosvideos">videos section</a>.
          </p>
          <p>
            Cumbria County Council have also produced this child-friendly video as part of their ‘Rubbish Rebels’ series.
          </p>
          <client-only>
            <LazyYoutubeVideo src="https://www.youtube.com/embed/EvQKfTg82fI" />
          </client-only>

          <h3>Radio</h3>
          <p>
            Here is an example of how Essex County Council used its local Heart FM website to promote reuse with Freegle.
            <a href="https://www.heart.co.uk/essex/events/essex-county-council-freegle/" target="_blank">
              https://www.heart.co.uk/essex/events/essex-county-council-freegle/
            </a>
          </p>
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
      'Councils - Other Councils',
      'Here is some example promotional activity from other councils.'
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
