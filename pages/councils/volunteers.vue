<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Working with your local Freegle volunteers
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Each Freegle community is run by volunteers and they are there to help you and the members of that
            community get the best out of Freegle.  Keeping in touch with them can really help build a good
            relationship and ultimately benefit your council.
          </p>
          <p>
            Your local volunteer can post events and messages
            on behalf of your council, help with your waste reduction campaigns and they may even be able to
            attend any events you may be running.
          </p>
          <p>
            You can find their contact details on <nuxt-link to="/explore">
              your local group pages
            </nuxt-link>, or email
            <ExternalLink href="mailto:councils@ilovefreegle.org">councils@ilovefreegle.org</ExternalLink> and we can provide you with them.
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
      'Councils - Working with Freegle Volunteers',
      'Here is some suggested wording for giving an overview of Freegle. You can use all of part of it on your websites, publicity and when speaking directly with residents.'
    )
  }
}
</script>
