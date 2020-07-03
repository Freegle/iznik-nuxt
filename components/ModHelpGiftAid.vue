<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are people who have completed gift aid declarations which have not yet been reviewed.
    </p>
    <p>
      Please check the name and address:
    </p>
    <ul>
      <li>
        If it looks fine, then click <em>Looks Good</em>.  We will then correlate this with their donations, and use
        that information later when submitting a Gift Aid claim.
      </li>
      <li>
        If the name or address is wrong but in an obvious way, please fix it and click <em>Save Changes</em>.
      </li>
      <li>
        If it's missing key information, then please click on their email address and ask them to provide it.  You
        can then do the correction here.
      </li>
    </ul>
    <p>
      We might need something here to remove ones who never reply, but if there are any of those then for now just
      ask Edward.
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import helpBox from '@/mixins/helpBox'

export default {
  components: { NoticeMessage },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'giftaid'
    }
  }
}
</script>
