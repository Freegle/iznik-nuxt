<template>
  <b-row class="m-0">
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
      </ul>
      <p>
        You wouldn't be freegling unless someone had told you about it - can you pay it forward?
      </p>
      <h3>Put up a poster</h3>
      <p>This is an A4 poster with tear-off strips - good for noticeboards in cafes, community venues, or at work.</p>
      <a href="https://freegle.in/A4Poster" target="_blank">
        <b-img-lazy src="~static/posters/A4.png" class="poster" />
        <br>
        <b-btn variant="success" size="lg" class="mt-2 mb-2">
          Download Poster
        </b-btn>
      </a>
      <p>
        You can help even more by letting us know where you put up posters. Once we know where it is, then
        we can encourage other freeglers to put one up there in future. <b>Please do this!</b>
      </p>
      <b-btn variant="info" size="lg" @click="added">
        I put up a poster
      </b-btn>
      <hr>
      <h3>Invite your friends</h3>
      <div v-if="me.invitesleft > 0">
        <p class="bg-info p-2">
          You have <b>{{ me.invitesleft | pluralize('invitation', { includeNumber: true }) }}</b> left.
        </p>
        <b-card class="mb-1">
          <p>
            We'll send them an email invitation. It will show your name and email.
          </p>
          <b-input-group>
            <b-input
              v-model="invitemail"
              type="email"
              size="lg"
              placeholder="Enter their email address"
            />
            <b-input-group-append>
              <b-button variant="success" size="lg" @click="invite">
                <v-icon name="envelope" />&nbsp;Invite a friend
              </b-button>
            </b-input-group-append>
          </b-input-group>
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
      TODO
      <hr>
      <h3>Tell your story</h3>
      <b-btn to="/stories" variant="primary" size="lg">
        <v-name icon="book-open" />Tell your story
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
import PosterModal from '../components/PosterModal'
// TODO LOW Record who downloads a poster.  Then we can chase them later to find out if they put them up.
// TODO Link to page of noticeboards already put up.
// TODO Validation on email invitation.
// TODO Invitation accept page.

export default {
  components: { PosterModal },
  data: function() {
    return {
      invitemail: null
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']()
    },
    invitations() {
      return Object.values(this.$store.getters['invitations/list']())
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
  }
}
</script>
