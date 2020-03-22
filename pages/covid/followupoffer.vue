<template>
  <div class="d-flex justify-content-center">
    <div class="disclaimer__container px-3 bg-white">
      <h1 class="text-center">
        COVID-19 - Next Step
      </h1>
      <p>
        Thanks so much for offering to help.  We want to make sure we do this safely, especially since people
        will be more vulnerable just now.
      </p>
      <p>
        We would like a contact phone number and a little introduction about yourself.  We will pass this on to
        people near you who we think need help.
      </p>
      <label for="phone">
        <b>Contact phone number</b>
      </label>
      <b-input id="phone" v-model="phone" type="tel" placeholder="Please enter a contact phone number" class="mb-1" />
      <label for="intro">
        <b class="mt-1">Introduce yourself</b>
      </label>
      <b-textarea id="intro" v-model="intro" placeholder="Say a bit about yourself for the person who needs help." class="mt-1 mb-1" rows="3" />
      <div class="d-flex justify-content-between">
        <b-btn variant="success" size="lg" class="mt-1 mb-2" @click="save">
          <v-icon v-if="saving" name="sync" class="fa-spin" />
          <v-icon v-else-if="saved" name="check" />
          <v-icon v-else name="save" />
          Save
        </b-btn>
        <b-btn variant="primary" size="lg" class="mt-1 mb-2" @click="nolonger">
          <v-icon v-if="savingnolonger" name="sync" class="fa-spin" />
          <v-icon v-else-if="savednolonger" name="check" />
          <v-icon v-else name="save" />
          No longer available
        </b-btn>
      </div>
      <NoticeMessage v-if="saved" variant="info">
        Thanks, we'll be in touch.  Please be patient - we'll all be dealing with this for a while, and we're
        trying to build a list of people who can help over the next few weeks, not just
        this afternoon.
      </NoticeMessage>
      <hr>
      <p>
        Freegle won't use this for anything else and we'll delete it all once this is all over.
      </p>
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
      type: null,
      phone: null,
      intro: null,
      saving: false,
      saved: false,
      savingnolonger: false,
      savednolonger: false,
      covidid: null
    }
  },
  watch: {
    me(newme) {
      const type = this.$store.getters['misc/get']('covid')
      if (newme && type) {
        this.record(type)
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('covid/fetch', {
      userid: this.myid
    })

    const covid = this.$store.getters['covid/getByUserId'](this.myid)

    this.covidid = covid.id
    this.phone = covid.phone
    this.intro = covid.intro
  },
  methods: {
    offer() {
      this.waitForRef('infomodal', () => {
        this.$refs.infomodal.show()
      })
    },
    async save() {
      this.saving = true

      await this.$store.dispatch('covid/edit', {
        id: this.covidid,
        phone: this.phone,
        intro: this.intro
      })

      this.saving = false
      this.saved = true
    },
    async nolonger() {
      this.savingnolonger = true

      await this.$store.dispatch('covid/edit', {
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
