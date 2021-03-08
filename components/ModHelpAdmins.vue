<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      ADMINs are sent to everyone on your group, no matter what their mail settings are, including members
      flagged as bouncing.
    </p>
    <p>
      Sometimes you will see centrally suggested ADMINs here for you to edit/approve/reject as you choose.
    </p>
    <p>
      Read more about ADMINs
      <!-- eslint-disable-next-line -->
      <ExternalLink href="https://wiki.ilovefreegle.org/Admins">on the wiki</ExternalLink>.
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import helpBox from '@/mixins/helpBox'
import NoticeMessage from './NoticeMessage'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { NoticeMessage, ExternalLink },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'admins'
    }
  }
}
</script>
