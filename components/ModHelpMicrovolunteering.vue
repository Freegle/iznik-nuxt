<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p class="text-danger">
      This is a work in progress.
    </p>
    <p>
      This page shows the people who've done the most micro-volunteering in the last 90 days.
    </p>
    <ul>
      <li>
        The activity graph shows how often they've been active.  The more shaded area, the more active they've been.
      </li>
      <li>
        Accuracy indicates how often they have agreed with the consensus from other micro-volunteers.  Only some
        micro-volunteering tasks require consensus (e.g. rotating photos doesn't).
      </li>
    </ul>
    <p>
      You can use this to see whether people might be worth talking to as possible moderators.
    </p>
    <ul>
      <li>
        Regular or continuous activity is good because it indicates a good commitment to Freegle.
      </li>
      <li>
        High accuracy probably indicates reasonable judgement. You can review their activity using <em>View</em>.
      </li>
      <li>
        You can try them out on more advanced tasks, like reviewing Pending messages.
        Click on their ID and change their <em>Volunteering</em> status to <em>Advanced</em>.  That is a
        setting for this user - it will apply across all groups they're on with micro-volunteering enabled.
      </li>
      <li>
        If they stay active and have good accuracy, then it might be worth contacting them.
      </li>
    </ul>
    <p>
      <!-- eslint-disable-next-line -->
      Read more <ExternalLink href="https://wiki.ilovefreegle.org/Microvolunteering">on the wiki</ExternalLink>.
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import helpBox from '@/mixins/helpBox'
import NoticeMessage from './NoticeMessage'
import ExternalLink from '~/components/ExternalLink'

export default {
  components: { ExternalLink, NoticeMessage },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'feedback'
    }
  }
}
</script>
