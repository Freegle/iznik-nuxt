<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Freegle Focus Case Study: London Borough of Sutton & Freegle<br>
            <em>Office furniture - Reuse best practice - Supporting the community</em>
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <h2>Summary</h2>
          <p>
            Ahead of a major office refurbishment project in early 2022, London Borough of Sutton worked with Freegle to successfully re-home over 100 surplus pieces of large office furniture, as well as many smaller items.
          </p>
          <p>
            Individuals, local groups and charities from the local area came forward to claim these useful items direct from the council, at no cost.
          </p>
          <p>
            Read on to find out why this reuse project was initiated, how it was organised, the key successes and lessons learnt.
          </p>
          <h2>
            Climate Emergency: Sutton’s ambitious targets
          </h2>
          <p>
            In 2019 Sutton Council declared a Climate Emergency which was incorporated into the borough's ambitious Environment Strategy 2019 - 2025. The aims include achieving net zero carbon emissions and becoming London’s most sustainable borough.
          </p>
          <h2>
            Office refurbishment creates reuse opportunity
          </h2>
          <p>
            In late 2021, ahead of a major refurbishment project involving one of the council's buildings, London Borough of Sutton contacted Freegle to discuss how the Freegle platform could be used to help re-home a large collection of soon-to-be surplus office furniture and equipment.
          </p>
          <p>
            Officers from Sutton discussed the options together with Freegle central and the local Freegle community volunteer moderator and put together a plan.
          </p>
          <h2>
            An OFFER posted on Freegle
          </h2>
          <b-img fluid src="/councils/casestudies/SuttonOFFER.png" />
          <p>
            An OFFER posted on Sutton Freegle invited local residents, groups and organisations to visit the council building and pick up items they wished to re-home.
          </p>
          <p>
            Items on offer included desks, meeting room tables, chairs, storage units, cupboards, bookcases and coat stands. Smaller items of office equipment were also available, including in-trays, staplers, hole punches, stationery, folders, monitor stands and foot rests.
          </p>
          <p>
            Initially one 'open day' was arranged, followed by some additional promotion including some internal publicity within the  organisation.  To allow ample time for viewing, selecting and collection of items, two additional open days were held.
          </p>
          <p>
            All items were offered free of charge however Sutton made clear in the OFFER that transportation and removal of items had to be arranged by the individual ‘takers'.
          </p>
          <p>
            Around twenty individuals attended including representatives from a local church, a children’s charity and four of the borough's local schools. Sutton council provided staff on three floors to help and direct visitors.
          </p>
          <div class="even">
            <b-img src="/councils/casestudies/SuttonCabinets.png" thumbnail />
            <b-img src="/councils/casestudies/SuttonDesks.png" thumbnail />
            <b-img src="/councils/casestudies/SuttonOfficeChairs.png" thumbnail />
          </div>
          <h2>
            Sutton Freegle Quick Facts
          </h2>
          <p>
            Founded in 2018, Sutton Freegle has 6,561 current freeglers.
          </p>
          <p>
            Over the 12 months to September 2022 this community facilitated 156 tonnes of reuse, saved 79.7 tonnes of
            GHG emissions. The reuse equates to £111,102 worth of financial savings.
          </p>
          <h2>
            Impacts of Reuse
          </h2>
          <p>
            Councillor Barry Lewis, Chair of Environment & Sustainable Transport Committee said:
          </p>
          <p class="quote">
            We want Sutton to become London's most sustainable borough and a key part of this is creating a circular
            economy. I'm therefore delighted that over 200 items of surplus furniture have gone to new homes through
            Freegle instead of being sent to landfill.
            This partnership has helped us reduce waste, increase reuse and help to support local people and
            organisations.
          </p>
          <p>
            Coady Johnston , Project Officer, Policy & Transformation commented:
          </p>
          <p class="quote">
            It was really lovely to give another life to our surplus furniture - redirecting it from landfill. We saw a
            variety of reuse, from helping people perfect their home offices, to charities and even schools.

            It was a win-win for the council and the community!
          </p>
          <p>
            Dee - volunteer from Sutton Freegle community added:
          </p>
          <p class="quote">
            I am delighted that the Freegle platform has been able to help Sutton to  reuse these surplus items.
            I took a chair myself which in the end, was not needed so I swiftly passed it on - through Freegle of
            course!
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
import CouncilsContent from '~/components/CouncilsContent'

export default {
  components: { CouncilsContent },
  mixins: [buildHead, sectionScroll],
  head() {
    return this.buildHead(
      'Councils - Essex',
      'Essex County Council & Freegle - supporting resilient communities through reuse',
      '/councils/casestudies/essex3.png'
    )
  }
}
</script>
<style scoped lang="scss">
.large {
  font-size: 1.5rem;
}

.quote {
  font-size: 1.25rem;
  font-weight: bold;
  font-style: italic;

  &::before {
    content: open-quote;
  }

  &::after {
    content: close-quote;
  }
}

.even {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
}
</style>
