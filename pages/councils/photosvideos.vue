<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Photos and videos
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <a id="photos" class="anchor" />
          <h3>
            Photos
          </h3>
          <p>
            Looking for some images of items being Freegled?  We have permission to use these fantastic photographs
            which were published in the first issue of National Geographic 'Green' December 2009 to illustrate Sarah
            Lonsdale's article on recycling initiatives.  Pictured are Freegle members in Hackney and Waltham Forest.
            If you would like to use these, please ensure that they are referenced.
            <a href="http://www.inviewphotography.co.uk/freegle.htm" target="_blank">www.inviewphotography.co.uk/freegle.htm</a>
          </p>
          <p>
            You may also be able to find willing local Freegle members who would be happy to feature in photographs
            for your own campaign.
          </p>
          <a id="videos" class="anchor" />
          <h3>
            Videos
          </h3>
          <p>
            Freegle have recently commissioned this video which is free for you to use and works particularly well on
            social media.
          </p>
          <client-only>
            <LazyYoutubeVideo url="https://www.youtube.com/watch?v=Gw_wpkbNQY8" />
          </client-only>
          <p>
            We can provide the video source files <a href="mailto:councils@ilovefreegle.org">on request</a>.
            If you modify the video, then please preserve the
            Commoners Choir and Saucy Horse credits from the frame at the end of the video.
          </p>
          <p>
            Cumbria County Council made these videos which they are happy to share.  You can add your own logo and use
            them free of charge as long as Cumbria County Council are referenced.  Please
            email <a href="mailto:councils@ilovefreegle.org">councils@ilovefreegle.org</a> and we
            can help you arrange this.
          </p>
          <ul>
            <li><a href="https://www.youtube.com/watch?v=xyJuUNH5Xrg">10 tips for Freegling</a></li>
            <li><a href="https://www.youtube.com/watch?v=YA9dvQQG8hA">How to find stuff on Freegle</a></li>
            <li><a href="https://www.youtube.com/watch?v=aDUCknGVZiA">How to give stuff away on Freegle</a></li>
          </ul>
          <p>
            We also have a YouTube channel on which you can view promotional videos and get some
            inspiration by seeing the work of Cumbria Freegle in action.  Click
            <a href="https://www.youtube.com/channel/UC47ivQhz3FvrTeuDp3Ov_9w" target="_blank">here</a>.
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
      'Councils - Photos and videos',
      'Looking for some images of items being Freegled?'
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
