<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="bg-white">
      <div>
        <h1>We've removed your account</h1>
        <p>
          We've cleared all your data.  You're welcome back in the future if you change your mind.
        </p>
        <p>
          Occasionally you may receive emails for upto a few more hours - emails may have been sent to you but
          not yet reached your mailbox.  If you receive any more emails after 24 hours please forward the entire
          mail to
          <!-- eslint-disable-next-line -->
          <ExternalLink href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</ExternalLink>.
        </p>
      </div>
    </b-col>
    <b-col cols="0" md="3" />
  </b-row>
</template>
<script>
import ExternalLink from '../components/ExternalLink'
export default {
  components: { ExternalLink }
}
</script>
