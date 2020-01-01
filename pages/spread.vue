<template>
  <b-row class="m-0 bg-white">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="mt-2">
      <h2>
        Spread the word
      </h2>
      <p>
        Wouldn't the world be better if more people freegled more often? You can help!
      </p>
      <ul>
        <li><b>Tell people!</b> It's easy to forget that lots of people still haven't heard of us.</li>
        <li><b>Put up a poster.</b></li>
        <li><b>Invite your friends</b> by email.</li>
        <li><b>Tell your story</b>.</li>
      </ul>
      <p>
        You wouldn't be freegling unless someone had told you about it - can you pay it forward?
      </p>
      <h3>Put up a poster</h3>
      <p>This is an A4 poster with tear-off strips - good for noticeboards in cafes, community venues, or at work.</p>
      <a href="https://freegle.in/A4Poster" target="_blank">
        <b-img-lazy src="~static/posters/A4.png" class="poster border border-dark mb-2" />
        <br>
        <b-btn variant="success" size="lg" class="mt-2 mb-2">
          Download poster
        </b-btn>
      </a>
      <p>
        You can help even more by letting us know where you put up posters. Once we know where it is, then
        we can encourage other freeglers to put one up there in future. <b>Please do this!</b>
      </p>
      <b-btn variant="info" size="lg" class="mb-1" @click="added">
        I put up a poster!
      </b-btn>
      <p>
        You can see where people have put up posters <nuxt-link to="/noticeboards">
          here
        </nuxt-link>.
      </p>
      <hr>
      <h3>Invite your friends</h3>
      <div v-if="me && me.invitesleft > 0">
        <p class="bg-info p-2">
          You have <b>{{ me.invitesleft | pluralize('invitation', { includeNumber: true }) }}</b> left.
        </p>
        <b-card class="mb-1">
          <p>
            We'll send them an email invitation. It will show your name and email.
          </p>
          <validating-form>
            <b-input-group>
              <validating-form-input
                v-model.trim="invitemail"
                type="email"
                size="lg"
                placeholder="Enter their email address"
                :validation="$v.invitemail"
                :validation-enabled="validationEnabled"
                :validation-messages="{
                  required: 'That isn\'t a valid email address - can you check?'
                }"
              />
              <b-input-group-append>
                <b-button v-if="!validationEnabled || !$v.invitemail.$invalid" variant="success" size="lg" @click="invite">
                  <v-icon name="envelope" />&nbsp;Invite a friend
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </validating-form>
          <span class="small text-muted">
            By using this you confirm that you have their consent.  That's a PECR/GDPR thing.
          </span>
        </b-card>
        <div v-if="invitations && invitations.length">
          <h5>Your recent invitations</h5>
          <div v-for="invitation in invitations" :key="invitation.id">
            <b-row>
              <b-col cols="6" sm="4">
                {{ invitation.email }}
              </b-col>
              <b-col cols="6" sm="4">
                invited {{ invitation.date | timeago }}
              </b-col>
              <b-col cols="6" sm="4">
                {{ invitation.outcome }}
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="bg-info p-2">
          You have no invitations left at the moment.  You'll get more when one of the people you invited accepts, or
          after a while.
        </p>
      </div>
      <hr>
      <h3>Business Cards</h3>
      <p>
        You can get little "business cards" to hand out to people or put on noticeboards.  They're small, so it's
        easy to always have a few with you.
      </p>
      <p>You can order these from firms like <a href="https://www.instantprint.co.uk/business-cards/economy?lamination=no&size=85-x-55-mm&paper=350gsm-silk&sided=single&finish=standard-corners&rangesizeq=0">Instantprint</a> - download our PDF and upload it to their site when ordering.</p>
      <b-img-lazy src="/businesscards/FreegleBusinessCardSmall.png" class="border border-dark mb-2" />
      <br>
      <a href="https://freegle.in/BusinessCardFront" target="_blank" class="mt-1 mb-1">
        <b-btn size="lg" variant="primary">
          Download business card
        </b-btn>
      </a>
      <hr>
      <h3>
        Tell your story
      </h3>
      <p>This helps encourage other people to try freegling.</p>
      <b-btn to="/stories" variant="primary" size="lg">
        <v-icon name="book-open" /> Tell your story
      </b-btn>
    </b-col>
    <PosterModal ref="modal" />
  </b-row>
</template>
<style>
.poster {
  width: 300px;
}
</style>
<script>
import { required, email } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import PosterModal from '../components/PosterModal'
import buildHead from '../mixins/buildHead'
import ValidatingForm from '../components/ValidatingForm'
import ValidatingFormInput from '../components/ValidatingFormInput'
import validationHelpers from '@/mixins/validationHelpers'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: { ValidatingForm, ValidatingFormInput, PosterModal },
  mixins: [loginRequired, buildHead, validationMixin, validationHelpers],
  data: function() {
    return {
      invitemail: null
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    },
    invitations() {
      return Object.values(this.$store.getters['invitations/list'])
    }
  },
  async mounted() {
    await this.$store.dispatch('invitations/fetch')
  },
  methods: {
    added() {
      this.$refs.modal.show()
    },
    async invite() {
      if (this.invitemail) {
        await this.$store.dispatch('invitations/add', {
          email: this.invitemail
        })

        this.invitemail = null
      }
    }
  },
  validations: {
    invitemail: {
      required,
      email
    }
  },
  head() {
    return this.buildHead(
      'Spread the Word',
      'Can you pass it on? Help us get more people freegling more often...'
    )
  }
}
</script>
