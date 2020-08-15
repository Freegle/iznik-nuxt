<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Sharing best practice
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            If you have PR Materials, good stories or a report of a successful promotion you would be happy to share
            with other councils, please email
            <!-- eslint-disable-next-line -->
            <ExternalLink href="mailto:councils@ilovefreegle.org">councils@ilovefreegle.org</ExternalLink>.
            We’d love to hear from you and could even turn your good work into a case study.
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
      'Councils - Sharing best practice',
      'We’d love to hear from you and could even turn your good work into a case study.'
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
