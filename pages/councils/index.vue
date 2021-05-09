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
          <NoticeMessage variant="info">
            <p>
              Freegle sends out regular, quick read newsletters to councils. <strong>Freegle Bites</strong> gives councils
              the latest reuse news plus practical help and advice on how you can support reuse in your community.
            </p>
            <b-btn variant="primary" size="lg" href="https://us20.campaign-archive.com/home/?u=dd0a44d9aa3f6ba0e4d439318&id=8edc47538e">
              View the archive and sign up
            </b-btn>
          </NoticeMessage>
        </b-card-text>
      </b-card>
      <CouncilsContent class="mt-2" />
    </b-col>
  </b-row>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'
import NoticeMessage from '@/components/NoticeMessage'
const CouncilsContent = () => import('~/components/CouncilsContent')
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    NoticeMessage,
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
