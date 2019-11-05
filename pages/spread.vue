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
      <h3>Invite your friends</h3>
      TODO
      <h3>Business Cards</h3>
      TODO
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

export default {
  components: { PosterModal },
  computed: {},
  methods: {
    added() {
      this.$refs.modal.show()
    }
  }
}
</script>
