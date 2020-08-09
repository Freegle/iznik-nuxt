<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Why use Freegle? What’s in it for councils?
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <client-only>
            <LazyYoutubeVideo src="https://www.youtube.com/embed/hXNWj2sZ7ZM" />
          </client-only>
          <p>
            There are many charities and other organisations that councils promote and work with to encourage reuse
            amongst their residents.  Freegle is just one of those, so why should councils work with us?
          </p>

          <h4>A free and established reuse organisation</h4>
          <p>
            Freegle is an established resource for encouraging and facilitating a culture of reuse in the community.
            At a time when staff are stretched in local authorities, it is of value to have free support from an
            external organisation that already has the infrastructure in place, a bank of dedicated volunteers,
            as well as free statistics and other resources that can be tailored to your needs.
          </p>

          <h4>Easy to join, easy to use</h4>

          <p>
            Freegle is web and app-based, making it a low barrier to entry for residents.  Our volunteers provide
            support to the members of each Freegle community.
          </p>

          <h4>Reducing waste through HWRCs, bulky and household collections</h4>

          <p>
            Freegle is an example of an alternative route to waste disposal for certain items.  Residents can
            be directed there to help reduce the amount of waste received by the council through HWRCs, household
            and bulky collections.  Some residents do not have easy access to HWRCs or may find it difficult to pay
            for items to be collected.  Pointing residents towards Freegle can result in cost savings for residents
            and the council, whilst keeping the items in use for longer, encouraging repair and upcycling.
          </p>

          <h4>Helping to reduce fly-tipping and contamination</h4>

          <p>
            Freegle can help to reduce incidences of fly-tipping and contamination by providing a simple solution to
            passing items on.  The whole process can be completed online and items can be collected from members’
            homes.  Freegle can work particularly well for flatted properties and estates where urban fly-tipping and
            communal bin contamination can be a real issue.  We can even provide publicity and trackable links to our
            website that will help you monitor such properties.
          </p>

          <h4>Talking of stats…</h4>

          <p>
            We have lots of them and they are all free for councils:
          </p>
          <ul>
            <li>Monthly reuse data summaries.</li>
            <li>Freegle activity Heatmap.</li>
            <li>
              Time-specific data, area-specific data (including by postcode), data on request and we can even overlay
              it with a range of demographic indicators.
            </li>
          </ul>
          <p>
            We also use WRAP's Benefits of Reuse tool to generate CO2 and cost savings data.
          </p>

          <h4>Opening up lines of communication in the community</h4>

          <p>
            Freegle is integrated into the local community and so can provide a useful communication channel for
            councils to utilise and connect with residents that may have otherwise been out of reach.
            Freegle is also an established and trusted community tool.  It can be used to deliver and 'soften'
            council communications.  We can publicise council events and campaigns on each Freegle community
            webpage and send out admin messages to members of individual communities to support your work.
          </p>

          <h4>Why run a project with Freegle?</h4>

          <p>
            Freegle is likely to be a more cost-effective way of delivering reuse campaigns because councils can
            utilise Freegle’s existing infrastructure and network of volunteers.  Freegle is an established community
            reuse tool; we already have 2.7 million members of which over 600,000 are active annually and so is a
            valuable resource for councils to tap into.
          </p>

          <p>
            Our volunteers are a direct link with the community and can provide an additional (free) resource for
            councils.  Some may also be able to help at your local events.
          </p>

          <p>
            We can help your run campaigns using this Communications Toolkit; we can assist you to
            monitor your work by providing free high and low-level tailored stats based on the Reuse Network’s Product
            Weight Protocols; provide trackable links to monitor specific campaigns or communities and provide
            data output for these.  We can also put you in touch with other councils who are already working with
            Freegle so that you can share ideas.
          </p>

          <p>
            You can further boost what can be achieved by funding specific projects or campaigns; we are happy
            to discuss any ideas you may have.
          </p>

          <h4>Freegle and reuse data</h4>

          <p>
            Freegle facilitates peer-to-peer reuse, but Freegle does not take ownership of this waste at any time
            and so we have been advised by WasteDataFlow that our data cannot be submitted to WDF. We are however,
            continuing to explore with Defra how the contribution to waste prevention, by organisations such
            as Freegle, is recognised.
          </p>
          <p>
            Our data can of course be reported internally and externally as a measure of active waste prevention in
            your area and can be used to help monitor any campaigns you might run in partnership with us.
          </p>

          <p>
            We are trying to find out if and how councils across the UK use Freegle data to measure waste diversion
            and support their waste minimisation campaigns. Please get in touch to let us know if you use our
            data and if not, how we could make it more useful for you at
            <ExternalLink href="mailto:councils@ilovefreegle.org">
              councils@ilovefreegle.org
            </ExternalLink>.
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
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { CouncilsContent, ExternalLink },
  mixins: [buildHead],
  head() {
    return this.buildHead(
      'Councils - Why use Freegle? What’s in it for councils?',
      'Here is some suggested wording for giving an overview of Freegle. You can use all of part of it on your websites, publicity and when speaking directly with residents.'
    )
  }
}
</script>
