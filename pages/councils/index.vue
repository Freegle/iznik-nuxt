<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Communications Toolkit for Councils
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Welcome to the Freegle Communications Toolkit for councils!
          </p>

          <p>
            We have included everything here that we think you will need to help support your work with Freegle and
            ultimately help you to increase reuse in your area.
          </p>

          <p>
            If there is anything that you would like and can’t find it here, please just ask. For general enquiries
            <!-- eslint-disable-next-line -->
            please email <ExternalLink href="mailto:councils@ilovefreegle.org">councils@ilovefreegle.org</ExternalLink>.
            For enquiries relating to graphics and logos please email
            <!-- eslint-disable-next-line -->
            <ExternalLink href="mailto:media@ilovefreegle.org">media@ilovefreegle.org</ExternalLink>.
          </p>
        </b-card-text>
      </b-card>
      <CouncilsContent class="mt-2" />
    </b-col>
  </b-row>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'
const CouncilsContent = () => import('~/components/CouncilsContent')
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    CouncilsContent,
    ExternalLink
  },
  mixins: [buildHead],
  head() {
    return this.buildHead(
      'Communications Toolkit for Councils',
      'Welcome to the Freegle Communications Toolkit for councils!  We have included everything here that we think you will need to help support your work with Freegle and ultimately help you to increase reuse in your area.'
    )
  }
}
</script>
