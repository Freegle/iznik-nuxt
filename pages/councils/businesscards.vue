<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Business Cards
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Business cards are a simple and inexpensive way for your council to promote Freegle and are a good
            alternative when a poster may not be appropriate.  Business cards can be handed out at your events,
            left at council owned or managed buildings for distribution or sent out with mailshots.
          </p>
          <p>
            A generic Freegle business card graphic is available but If you want another size or a specific
            design for your council, just email <a href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</a>.
          </p>
          <p>Click to download:</p>
          <ul>
            <li>
              <a target="_blank" href="https://freegle.in/BusinessCardFront">Front side</a>
            </li>
            <li>
              <a target="_blank" href="https://freegle.in/BusinessCardBack">Back side</a>
            </li>
          </ul>
          <p>
            There are lots of places that you can leave business cards…
          </p>
          <ul>
            <li>Cafes</li>
            <li>Cinemas</li>
            <li>Arrange with friendly retailers to hand them out (usually ones with green aspirations).</li>
            <li>Supermarket noticeboards</li>
            <li>Corner shops and newsagents</li>
            <li>Estate agents</li>
            <li>Repair stores</li>
            <li>Takeaways</li>
            <li>Charity shops - suggest they can hand them to people who offer electrical or other stuff they can’t take in their shops.</li>
            <li>Chemists</li>
            <li>Carpet shops - good because they have lots of waste such as bits of carpet, wrapping, tubes etc.</li>
            <li>Churches, Synagogues and any other places of worship often have outreach projects and are happy to dish out the cards.</li>
            <li>Pubs & clubs</li>
            <li>Train stations</li>
            <li>Doctors and dentist surgeries</li>
            <li>By skips and bins (be selective with this option!)</li>
            <li>Bus shelters</li>
            <li>Shopping centres</li>
          </ul>
          <p>
            You could also try asking various places in the community to hand out cards:
          </p>
          <ul>
            <li>Citizens' Advice Bureau</li>
            <li>Housing advice places</li>
            <li>Community group venues</li>
            <li>Community halls</li>
            <li>Customer services at: Town Halls, removal companies, funeral directors</li>
            <li>Universities</li>
            <li>Parish halls</li>
            <li>MP's office</li>
            <li>Housing associations</li>
            <li>Housing estate offices</li>
            <li>Tradesmen</li>
            <li>Unemployment and other social help centres</li>
            <li>The TIP</li>
            <li>Green Fairs</li>
            <li>Libraries are good. Get hold of their Head Librarian and many will take some for each of their branches.</li>
            <li>Car Booters will give them out on their stalls, especially those who do it for charities.</li>
            <li>Building site in their office or even in the 'Show house'</li>
            <li>Schools, scouts etc. to give to the children for their parents.</li>
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
      'Councils - Business Cards',
      'Business cards are a simple and inexpensive way for your council to promote Freegle.'
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
