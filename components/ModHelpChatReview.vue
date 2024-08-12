<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      You will see a Chat Review if our system has picked up on one of the ‘worry words’ we have stored,
      such as a reference to money, swearing, a phone number or email address.
    </p>
    <p>
      If you are a mod on a group with the <em>Quicker Chat Review</em> setting in <em>Features for Moderators</em>
      then you may see chat here which is between members of other groups.  That's the point of that
      setting - it helps chats get reviewed more rapidly, which is better for the members.  If you're sure they
      look fine, approve them.  Otherwise leave them for the local group volunteers.
    </p>
    <p>
      Otherwise you will see chat messages here for review if the <b>recipient</b> is a member of one of your groups.
      You might see some where the conversation is about a post on a group that you don't moderate, because it’s not
      always possible for the system to tell reliably whether a message relates to a specific post, multiple posts,
      or no post at all. It’s fine to act on the message if you see it but unless it looks urgent it is
      better to leave it for the Mod on the group that the item was posted on.
    </p>
    <p>
      It is not our role to interfere with the flow of the member’s chat but if we happen to find violations of our
      rules, then we are allowed to act on them.
    </p>
    <p>
      You can use the ‘Add Moderator message’ to make members aware their chat has been reviewed and to let them know if
      they have broken a rule such as offering an item for sale in response to a Wanted on the board but this message
      does go to both sides of the chat so please word it accordingly.
    </p>
    <p>
      Read more about this on
      <!-- eslint-disable-next-line -->
      <ExternalLink href="https://wiki.ilovefreegle.org/Spammers#Chat_Review">the wiki</ExternalLink>
      .
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
      id: 'chatreview'
    }
  }
}
</script>
