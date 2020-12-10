<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are actions you can take to promote your group. For example, you will see social media posts which
      you might like to share to your communities' Facebook pages.
    </p>
    <p>
      You don't have to use Facebook yourself to do this. The share to Facebook will happen magically on the
      servers if you click the share buttons below.
    </p>
    <p>
      If you don't want to share a particular item, share any others that you do, then click the <em>Hide All</em>
      button.  This will hide it for all mods on this community.
    </p>
    <p>
      We can't do this automatically - as per
      <ExternalLink href="https://developers.facebook.com/docs/facebook-login/permissions#reference-manage_pages">
        Facebook's guidelines
      </ExternalLink>
      you need to explicitly decide to publish content on pages that you manage.
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
      id: 'publicity'
    }
  }
}
</script>
