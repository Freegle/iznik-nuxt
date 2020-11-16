<template>
  <b-row class="m-0 bg-white">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="mt-2">
      <h1 class="header--size2">
        Spread the word
      </h1>
      <p>
        Wouldn't the world be better if more people freegled more often? You can help!
      </p>
      <div v-if="contactPicker">
        <Invite />
        <hr>
        <h2>
          Other ways to help
        </h2>
      </div>
      <p>
        You wouldn't be freegling unless someone had told you about it - can you pay it forward?
      </p>
      <p>Here are some ways to help:</p>
      <ul>
        <li><b>Tell people!</b> It's easy to forget that lots of people still haven't heard of us.</li>
        <li><b>Put up a poster.</b></li>
        <li><b>Tell your story</b>.</li>
      </ul>
      <h3>
        Put up a poster
      </h3>
      <p>This is an A4 poster with tear-off strips - good for noticeboards in cafes, community venues, or at work.</p>
      <div>
        <b-form-radio-group
          v-model="language"
          buttons
          class="border border-success rounded mb-2 clickme"
        >
          <b-form-radio value="English" button-variant="outline-primary" class="clickme">
            English
          </b-form-radio>
          <b-form-radio value="Welsh" button-variant="outline-danger" class="clickme">
            Welsh
          </b-form-radio>
        </b-form-radio-group>
      </div>
      <div v-if="language === 'English'" class="d-flex flex-wrap">
        <div class="mr-1">
          <h3 class="header--size4">
            A4
          </h3>
          <a href="https://freegle.in/A4Poster" target="_blank" class="mr-2">
            <b-img-lazy src="~static/posters/A4.jpg" class="poster border border-dark mb-2" />
            <br>
            <b-btn variant="secondary" size="lg" class="mt-2 mb-2">
              Download poster
            </b-btn>
          </a>
        </div>
        <div class="mr-1">
          <h3 class="header--size4">
            A5
          </h3>
          <a href="~static/posters/A5.jpg" target="_blank" class="mr-2">
            <b-img-lazy src="~static/posters/A5.jpg" class="poster border border-dark mb-2" />
            <br>
            <b-btn variant="secondary" size="lg" class="mt-2 mb-2">
              Download poster
            </b-btn>
          </a>
        </div>
      </div>
      <div v-if="language === 'Welsh'" class="d-flex flex-wrap">
        <div class="mr-1">
          <h3 class="header--size4">
            A4
          </h3>
          <a href="~static/posters/A4Welsh.jpg" target="_blank">
            <b-img-lazy src="~static/posters/A4Welsh.jpg" class="poster border border-dark mb-2" />
            <br>
            <b-btn variant="secondary" size="lg" class="mt-2 mb-2">
              Download poster
            </b-btn>
          </a>
        </div>
        <div class="mr-1">
          <h3 class="header--size4">
            A5
          </h3>
          <a href="~static/posters/A5Welsh.jpg" target="_blank">
            <b-img-lazy src="~static/posters/A5Welsh.jpg" class="poster border border-dark mb-2" />
            <br>
            <b-btn variant="secondary" size="lg" class="mt-2 mb-2">
              Download poster
            </b-btn>
          </a>
        </div>
        <div class="mr-1">
          <h3 class="header--size4">
            A5 x 2
          </h3>
          <a href="~static/posters/A5x2Welsh.jpg" target="_blank">
            <b-img-lazy src="~static/posters/A5x2Welsh.jpg" class="poster border border-dark mb-2" />
            <br>
            <b-btn variant="secondary" size="lg" class="mt-2 mb-2">
              Download poster
            </b-btn>
          </a>
        </div>
      </div>
      <p>
        You can help even more by letting us know where you put up posters. Once we know where it is, then
        we can encourage other freeglers to put one up there in future. <b>Please do this!</b>
      </p>
      <b-btn variant="primary" size="lg" class="mb-1" @click="added">
        I put up a poster!
      </b-btn>
      <p>
        You can see where people have put up posters <nuxt-link to="/noticeboards">
          here
        </nuxt-link>.
      </p>
      <hr>
      <h2 class="header--size3">
        Business Cards
      </h2>
      <p>
        You can get little "business cards" to hand out to people or put on noticeboards.  They're small, so it's
        easy to always have a few with you.
      </p>
      <p>You can order these from firms like <a href="https://www.instantprint.co.uk/business-cards/economy?lamination=no&size=85-x-55-mm&paper=350gsm-silk&sided=single&finish=standard-corners&rangesizeq=0">Instantprint</a> - download our file and upload it to their site when ordering.</p>
      <div>
        <b-form-radio-group
          v-model="language"
          buttons
          class="border border-success rounded mb-2 clickme"
        >
          <b-form-radio value="English" button-variant="outline-primary" class="clickme">
            English
          </b-form-radio>
          <b-form-radio value="Welsh" button-variant="outline-danger" class="clickme">
            Welsh
          </b-form-radio>
        </b-form-radio-group>
      </div>
      <div v-if="language === 'English'">
        <div>
          <b-img-lazy src="/businesscards/FreegleBusinessCardSmall.jpg" class="border border-dark mb-2 mr-2 businesscard" />
        </div>
        <a href="https://freegle.in/BusinessCard" target="_blank" class="mt-1 mb-1">
          <b-btn size="lg" variant="primary">
            Download business card
          </b-btn>
        </a>
      </div>
      <div v-else>
        <div>
          <b-img-lazy src="/businesscards/FreegleBusinessCardSmallWelsh.jpg" class="border border-dark mb-2 businesscard" />
        </div>
        <a href="https://freegle.in/BusinessCardWelsh" target="_blank" class="mt-1 mb-1">
          <b-btn size="lg" variant="primary">
            Download business card
          </b-btn>
        </a>
      </div>
      <br>
      <hr>
      <h2 class="header--size3">
        Tell your story
      </h2>
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
import PosterModal from '../components/PosterModal'
import buildHead from '../mixins/buildHead'
import Invite from '../components/Invite'
import loginRequired from '@/mixins/loginRequired.js'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { Invite, PosterModal },
  mixins: [loginRequired, buildHead],
  data: function() {
    return {
      emailValid: false,
      language: 'English'
    }
  },
  computed: {
    contactPicker() {
      if (process.server) {
        return false
      } else {
        const ret =
          'contacts' in window.navigator && 'ContactsManager' in window
        return ret
      }
    }
  },
  methods: {
    added() {
      this.$refs.modal.show()
    }
  },
  head() {
    return this.buildHead(
      'Promote Freegle',
      'Can you pass it on? Help us get more people freegling more often...'
    )
  }
}
</script>
<style scoped>
.businesscard {
  width: 200px;
}
</style>
