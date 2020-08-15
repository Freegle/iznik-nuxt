<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Graphics, Logos and Badges
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            We have a full range of graphics, logos and badges available for you to use.  We can also personalise and
            customise these for you for free – please just ask
            <!-- eslint-disable-next-line -->
            <ExternalLink href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</ExternalLink>.
          </p>
          <a id="guidelines" class="anchor" />
          <h3>Guidelines for using the Freegle logo</h3>
          <p>
            Everyone has permission to use any of the Freegle logos for any Freegle purposes as long as they
            aren't profiting from such use.
          </p>
          <p>
            The colour used in the Freegle logo is RGB #5ECA24 (in RGB that's 94,202,36).  The nearest Pantone colour is
            Pantone 368. For CMYK use Cyan 55% Magenta 0% Yellow 97% Key 0%.
          </p>
          <p>
            <!-- eslint-disable-next-line -->
            You can also ask <ExternalLink href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</ExternalLink> for a customised logo for your group.
          </p>
          <a id="graphics" class="anchor" />
          <h3>Graphics</h3>
          <p>
            You are welcome to take any graphics from our social media streams
            <a href="https://twitter.com/thisisfreegle" target="_blank">@ThisIsFreegle</a> on Twitter and
            <a href="https://www.facebook.com/Freegle" target="_blank">Freegle</a> on Facebook -
            we create all the 'Freegle' graphics you see there and they are free to reuse.
            <!-- eslint-disable-next-line -->
            If you would like any graphics customised, please contact <ExternalLink href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</ExternalLink>.
          </p>
          <a id="logos" class="anchor" />
          <h3>
            Logos
          </h3>
          <p>
            These logos can be used however you like, on websites and social media, in newsletters, posters and signage.  There are two options:
          </p>
          <ul>
            <li><a href="/icon.png" target="_blank">Small heart logo</a></li>
            <li>
              <a href="/user_logo_vector.svg" target="_blank">Vector graphics logo</a>.
              This is a vector graphics version which can be resized as required without loss of quality. If you are unable to resize this
              <!-- eslint-disable-next-line -->
              yourself, we can do this for you, please just ask the <ExternalLink href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</ExternalLink>.
            </li>
          </ul>
          <a id="badges" class="anchor" />
          <h3>
            Badges
          </h3>
          <p>
            Badges provide a clickable link using HTML to Freegle that can be placed on your website.  For non-clickable
            logos, please see the ‘Logos’ section in this toolkit.
          </p>
          <p>
            To get the badge HTML, drag your mouse cursor over the HTML to highlight the code.
            In Windows, right-click and select Copy. Then paste into your web page code.
          </p>
          <pre>&lt;a href="https://www.ilovefreegle.org"&gt;&lt;img src="https://www.ilovefreegle.org/images/user_logo.png"
 title="Freegle: Don’t throw it away – give it away!" style="border:0;" /&gt;&lt;/a&gt;</pre>
          <p>
            Other sizes are available, please contact us if you would like something different.
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
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { CouncilsContent, ExternalLink },
  mixins: [buildHead, sectionScroll],
  head() {
    return this.buildHead(
      'Councils - Graphics, Logos and Badges',
      'We have a full range of graphics, logos and badges available for you to use.'
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
