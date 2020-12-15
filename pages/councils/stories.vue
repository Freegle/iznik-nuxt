<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            User Stories
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            We ask Freegle members for feedback whenever they give or take an item.  As a result, we have lots of
            great stories to share from members who have successfully gifted their unwanted items to other people
            in their community.
          </p>

          <p>
            You are welcome to use any of our user stories to help promote Freegle in your area.  There are a few
            examples below and more to be found at <nuxt-link to="/stories">
              https://www.ilovefreegle.org/stories
            </nuxt-link>.
            Many Freegle communities list stories on their homepage under 'Stories'.  If you are searching for a
            specific theme, item or part of the UK, please ask us, we might just have what you are looking for!
          </p>

          <p /><hr>
          <b>"I move frequently and find I have curtains, carpets, curtain rails etc each time I move.
            I have given beds and also requested a double bed. I managed to get a double bed however it came
            from three different sources, base, mattress and headboard. I share if I have excess in my garden
            also love to receive plants from others. I quilt so have managed to receive a very smart steam iron,
            ironing board and fold leaf table. The table I repainted and raised with feet and it is now a perfect
            height for my cutting out. I have over the years Freegled my son’s outgrown sportswear, tents, camping
            gear, logs and tree trimmings, net curtains, rails, a chest of drawers, a leather three piece suite,
            another sofa, office drawers, bedding, duvets, other items I can't recall at present. This system of
            sharing, repurposing, recycling, call it what you will is a wonderful way of making sure that things
            that have life in them don't get thrown away. Keep up the good work Just be polite when you request
            or reply to a plea. Ask for what you need not what you want."
          </b>
          <hr>

          <p>
            <b>"There is so much waste in our world and I very much appreciate Freegle's solution to the problem. I've
              Freegled things like hardcore, which I had no idea that anyone would want, and perfectly good items that
              I just no longer had a need for.  I've also received a lot of useful things including roof tiles, toilet,
              sink, bathroom cabinet, kitchen cabinets and a heated towel rail, all of which are now part of the
              scullery and downstairs. I've met some lovely people, too and would thoroughly recommend Freegle to
              anyone who wants to reduce waste and take a positive step towards improving our world."
            </b>
          </p><hr>

          <p>
            <b>
              "The toilets at my local Scout Group HQ left a little to be desired. Through the magic of Freegle I
              managed to source from some amazingly generous folk around the Barnsley area some tiles, a sink,
              grout, a tile cutter, everything we possible needed to refurbish both the ladies and gents toilets.
              No more embarrassment when anyone uses the loos now. In fact we are rather proud of our beautiful loos
              now. Thank you from the bottom of over 75 little hearts and quite a few grown up hearts."
            </b>
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
import buildHead from '@/mixins/buildHead.js'
import sectionScroll from '@/mixins/sectionScroll.js'
import CouncilsContent from '../../components/CouncilsContent'

export default {
  components: { CouncilsContent },
  mixins: [buildHead, sectionScroll],
  head() {
    return this.buildHead(
      'Councils - User Stories',
      'We ask Freegle members for feedback whenever they give or take an item. As a result, we have lots of great stories to share from members who have successfully gifted their unwanted items to other people in their community.'
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
