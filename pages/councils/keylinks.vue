<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Key website links
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Here are some handy links for you to use in your work and for publicity purposes.
          </p>
          <a id="communities" class="anchor" />
          <h3>
            Links to Freegle communities
          </h3>
          <p>
            <a href="https://www.ilovefreegle.org/explore" target="_blank" rel="noopener noreferrer">
              https://www.ilovefreegle.org/explore</a> - Use this link to find your local Freegle group, then add the
            links to your website.  For example, if you search for York, you can select the York Freegle group
            <a href="https://www.ilovefreegle.org/explore/York-Freegle" target="_blank" rel="noopener noreferrer">https://www.ilovefreegle.org/explore/York-Freegle</a>.
          </p>
          <a id="shortlinks" class="anchor" />
          <h3>Shortlinks</h3>
          <p>
            Shortlinks can help make your publicity easier.  They are short website addresses which redirect to
            longer ones. They are easier for potential members to remember and type than a long URL and are
            more practical for including on websites, posters, leaflets etc.
          </p>
          <p>
            Each Freegle community has a shortlink, and you can create your own trackable shortlinks to
            help you monitor activity.  Please go to the <nuxt-link to="/shortlinks">
              Shortlinks
            </nuxt-link> page for more info.
          </p>
          <p>
            An example shortlink would be <a href="https://freegle.in/croydon" rel="noopener noreferrer">freegle.in/croydon</a> which redirects to
            <a href="https://www.ilovefreegle.org/explore/Croydon-Freegle" rel="noopener noreferrer">https://www.ilovefreegle.org/explore/Croydon-Freegle</a>.
          </p>
          <a id="livestats" class="anchor" />
          <h3>
            Live Statistics
          </h3>
          <p>
            On each Freegle community’s page you can view live statistics for that particular community
            (the example below is for <a href="https://www.ilovefreegle.org/stats/York-Freegle" rel="noopener noreferrer">https://www.ilovefreegle.org/stats/York-Freegle</a>).
            We also use WRAP's Benefits of Reuse tool to generate CO2 and cost savings data.
          </p>
          <b-img class="mt-1" fluid src="~static/councils/yorkstats.png" />
          <p>
            You can also search for statistics for specific local authorities from
            <a href="https://www.ilovefreegle.org/stats/authorities" rel="noopener noreferrer">https://www.ilovefreegle.org/stats/authorities</a>
          </p>
          <a id="heatmap" class="anchor" />
          <h3>
            Heatmap
          </h3>
          <p>
            Our <nuxt-link to="/stats/heatmap">
              Freegling Heatmap
            </nuxt-link>
            shows how much reuse activity is taking place in any given area. We are able to
            provide a range of reuse data to councils, free of charge, as standard.  In addition, for councils
            who sponsor their local Freegle communities, we can supply detailed quarterly reuse data,
            including data at postcode level. For more information on how we can help support your local authority get
            in touch here:-
            <!-- eslint-disable-next-line -->
            <ExternalLink href="mailto:councils@ilovefreegle.org">councils@ilovefreegle.org</ExternalLink>.
          </p>
          <nuxt-link to="/stats/heatmap">
            <b-img fluid class="mt-1" src="~static/councils/heatmap.png" />
          </nuxt-link>
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
import ExternalLink from '@/components/ExternalLink'
import CouncilsContent from '../../components/CouncilsContent'

export default {
  components: { ExternalLink, CouncilsContent },
  mixins: [buildHead, sectionScroll],
  head() {
    return this.buildHead(
      'Councils - Key website links',
      'Here are some handy links for you to use in your work and for publicity purposes.'
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
