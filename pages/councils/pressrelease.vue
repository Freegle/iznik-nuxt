<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Template Press Release
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Here is a template press release that you are welcome to use and personalise.  Please note that the
            sections in <b>BOLD UPPER CASE</b> are for you to add your relevant information.
          </p>
          <h3>Freegle press release</h3>

          <p>
            Freegle is an easy and fun way for locals to give away and get things for free.  It’s all about making it
            easy for people to reuse goods and materials in their area.  Freegle helps you to get rid of things
            responsibly from the comfort of your own home; plus, you can help out someone else in your community,
            prevent waste and feel good at the same time!
          </p>

          <p>
            Freegle has over 2.7 million members in a UK-wide network of over 400 communities, each run by
            dedicated local volunteers. There are <b>NUMBER</b> local members in <b>YOUR AREA</b> already – all busy, giving
            away and getting stuff for free.
          </p>

          <p>
            Maybe you’ve finally got around to decluttering the loft or you’re modernising the office.  Perhaps you’ve
            moved and can’t fit that red sofa into your new flat or you have discovered an extra cheese grater you’ll
            never need.  Whether it be a TV, empty moving boxes, clothing, sports equipment, DIY materials, furniture,
            toys, books, some dishwasher tablets, office equipment, fresh squid or an old WWII shelter it is possible to
            give it away or get it for free using Freegle.
          </p>

          <p>
            It is really easy to be part of <b>YOUR AREA</b> Freegle – just go to www.ilovefreegle.org or download our app.
            Upon joining the group, you’ll receive simple instructions on how everything works and what to do.  Your
            local group volunteers are helpful and experienced Freeglers who will help you get started if
            you are new to it. Don’t be shy… join up, it really is easy and fun.
          </p>

          <p>
            So, whether you are an individual, family, old or young, a local organisation, sports club, charity,
            school or a business you can benefit from joining Freegle and start to offer any unwanted items you
            have to the members of the <b>YOUR AREA</b> group.  Other members will arrange to collect from you.  If
            there’s something you want then you can ask for that too…someone just may have what you are looking for,
            and no longer need it themselves.  You may even meet neighbours and discover positive initiatives going
            on in your area along the way.
          </p>

          <p>
            Freegle is great for reducing waste, but it can also foster community spirit, lessen consumerism,
            assist the economically challenged, reduce the burden on local council’s resources and encourage a
            more sustainable lifestyle... all done locally by locals and all done for free!
          </p>

          <p>
            If it’s free and it’s legal, then it can be Freegled! Go to <b>www.ilovefreegle.org</b> to get started.
          </p>

          <p>
            Twitter <b>@thisisfreegle</b><br>
            Facebook <b>@Freegle</b>
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
      'Councils - Template Press Release',
      'Here is a template press release that you are welcome to use and personalise.'
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
