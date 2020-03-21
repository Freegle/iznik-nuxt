<template>
  <div class="d-flex justify-content-center">
    <div class="disclaimer__container px-3 bg-white">
      <h1>
        COVID-19 - Next Step
      </h1>
      <CovidSuggestions v-if="id" :id="id" />
      <b-img v-else-if="busy" src="~/static/loader.gif" alt="Loading" />
      <NoticeMessage v-else-if="!myid" variant="info">
        Please log in to view the people who may be able to help.
      </NoticeMessage>
      <p>If you have problems with this page please mail us at <a href="mailto:covid19@ilovefreegle.org">covid19@ilovefreegle.org</a></p>
    </div>
  </div>
</template>

<script>
import CovidSuggestions from '../../components/CovidSuggestions'
import NoticeMessage from '../../components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { NoticeMessage, CovidSuggestions },
  mixins: [buildHead, loginRequired, waitForRef],
  data: function() {
    return {
      busy: true
    }
  },
  computed: {
    id() {
      let ret = null

      if (this.myid) {
        const covid = this.$store.getters['covid/getByUserId'](this.myid)

        if (covid) {
          ret = covid.id
        }
      }

      return ret
    }
  },
  watch: {
    me(newme) {
      if (newme) {
        this.fetchCovid()
      }
    }
  },
  mounted() {
    if (this.myid) {
      this.fetchCovid()
    }
  },
  methods: {
    async fetchCovid() {
      this.busy = true

      await this.$store.dispatch('covid/fetch', {
        userid: this.myid
      })

      this.busy = false
    }
  },
  head() {
    return this.buildHead(
      'COVID-19 - Helping your neighbours',
      "We're trying to connect people who need help with other people nearby who can provide it"
    )
  }
}
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.disclaimer__container {
  width: 100%;

  @include media-breakpoint-up(md) {
    width: 50%;
  }
}
</style>
