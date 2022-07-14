<template>
  <div>
    <client-only>
      <b-modal
        id="aboutmemodal"
        v-model="showModal"
        title="Freegle Aims"
        size="lg"
        no-stacking
      >
        <template slot="default">
          <NoticeMessage variant="info">
            After discussion
            <ExternalLink href="https://discourse.ilovefreegle.org/t/task-116-freegle-volunteer-agreement/4587">
              here
            </ExternalLink>
            we agreed to show this to all volunteers once a year.
          </NoticeMessage>
          <p class="mt-2">
            Thanks for volunteering for Freegle. Freegle is run nationally and in local Communities by volunteers. Here's what nationally and locally we aim to do and how we all can work to make Freegle good for us and members.
          </p>
          <h3>
            Freegle nationally is committed to:
          </h3>
          <ul>
            <li>Providing the IT infrastructure to list and host local Communities.</li>
            <li>Providing support for all aspects of running a Community by using email communications, national discussion forums and the Freegle wiki.</li>
            <li>Representing Freegle nationally and promoting freegling to national bodies and agencies.</li>
            <li>Running national social media and other publicity, and encouraging local freegling by provision of Modtools promotional facilities.</li>
            <li>Providing policies, guidance and insurance for local events to help ensure the safe running of Communities.</li>
            <li>Supporting all volunteers regardless of race, gender, age, sexuality, disability, religion, political belief, ethnic origin, marital status or nationality.</li>
            <li>Being open about how Freegle works and keeping everyone well informed.</li>
            <li>Ensuring that Freegle is run collaboratively, with all volunteers able to take part in decision making.</li>
            <li>Encouraging volunteers to join as an official Member of the Freegle Ltd Industrial and Provident Society.</li>
            <li>Supplying references for volunteers.</li>
          </ul>
          <h3>
            Local volunteers agree to run their Community by:
          </h3>
          <ul>
            <li>Following mandatory Freegle rules and considering best practice.</li>
            <li>Moderating their Community using Modtools, working with fellow volunteers to ensure that their Community is moderated at least daily, 7 days a week.</li>
            <li>Helping members with problems and information in a consistently positive way.</li>
            <li>Keeping in touch nationally, joining and engaging on Discourse.</li>
            <li>Not taking advantage of their position when personally freegling.</li>
          </ul>
          <p>...and it would also be great if local teams:</p>
          <ul>
            <li>Know the area that is served by their Freegle Community and have an interest in local and national environmental causes.</li>
            <li>Publicise their Community to build membership, eg do social media, press releases, run stalls, run events.</li>
            <li>Work with local councils or other relevant local bodies, businesses, charities etc to increase freegling in the community.</li>
            <li>Keep in touch with neighbouring volunteer teams.</li>
          </ul>
        </template>
        <template slot="modal-footer" slot-scope="{ cancel }">
          <b-button variant="white" @click="cancel">
            Close
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import ExternalLink from '@/components/ExternalLink'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage, ExternalLink },
  mixins: [modal],
  methods: {
    async show() {
      await this.fetchMe(['me', 'aboutme'])

      const me = this.$store.getters['auth/user']
      const lastshow = me?.settings?.lastaimsshow

      if (
        !lastshow ||
        this.$dayjs(lastshow).diff(this.$dayjs(), 'days') >= 365
      ) {
        this.showModal = true

        const settings = me.settings
        settings.lastaimsshow = this.$dayjs().toISOString()
        await this.$store.dispatch('auth/saveAndGet', {
          settings: settings
        })
      }
    }
  }
}
</script>
