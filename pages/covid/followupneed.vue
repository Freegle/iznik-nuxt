<template>
  <div class="d-flex justify-content-center">
    <div class="disclaimer__container px-3 bg-white">
      <NoticeMessage variant="danger">
        <p>
          We are sorry to say that in the light of the Government's announcement on 23rd March, we are suspending
          our COVID-19 assistance service.  If you are vulnerable, please register using the Government scheme
          <a href="https://www.gov.uk/coronavirus-extremely-vulnerable">here</a>.
        </p>
      </NoticeMessage>
    </div>
  </div>
</template>

<script>
import NoticeMessage from '../../components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { NoticeMessage },
  mixins: [buildHead, loginRequired, waitForRef],
  data: function() {
    return {
      busy: false,
      savingnolonger: false,
      savednolonger: false,
      covidid: null
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

      const covid = this.$store.getters['covid/getByUserId'](this.myid)

      this.covidid = covid.id
      this.phone = covid.phone
      this.intro = covid.intro

      this.busy = false
    },
    async nolonger() {
      this.savingnolonger = true

      await this.$store.dispatch('covid/nolonger', {
        id: this.covidid,
        closed: new Date().toISOString(),
        nolonger: 1
      })

      this.savingnolonger = false
      this.savednolonger = true
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
