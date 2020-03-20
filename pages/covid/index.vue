<template>
  <div class="d-flex justify-content-center">
    <div class="disclaimer__container px-3 bg-white">
      <h1 class="text-center">
        COVID-19 - Can you help?
      </h1>
      <p>
        Over the next couple of months, quite a lot of people may be ill or self-isolating.  They may need help with
        practical things like shopping and medicines, or with online support.  Maybe not yet, but maybe soon.
      </p>
      <p>
        Perhaps you can help.  Perhaps you
        (or someone you know) will need help.  Let's see if we can connect people so that we're ready.
      </p>
      <b-row>
        <b-col class="text-center">
          <h4>What's your postcode?</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="text-center mb-2 mt-2">
          <postcode class="justify-content-center" :find="false" @selected="postcodeSelect" @cleared="postcodeClear" />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" md="8" offset-md="2">
          <div class="d-flex justify-content-between w-100 mb-2">
            <b-btn variant="success" size="lg" class="mr-3" @click="offer">
              <client-only>
                <v-icon name="hand-holding-heart" />
              </client-only>
              I can help
            </b-btn>
            <b-btn variant="primary" size="lg" @click="need">
              <client-only>
                <v-icon name="cart-plus" />
              </client-only>
              I need help
            </b-btn>
          </div>
        </b-col>
      </b-row>
      <p>
        There may already be a great, well-organised scheme where you live.  If so, then get in touch with them
        if you haven't already - we're not trying to tread on anyone's toes.  But Freegle covers a lot of the UK,
        and it's full of lovely people.
      </p>
      <p>
        We don't know how many responses we get.  Maybe we'll just get a few - if so then we'll leave it in the
        (washed) hands of other people.  Maybe we'll get loads, and we'll need to work out how to put people
        in touch safely - that would be a good problem to have.  We won't pass on your details before
        getting back in touch with you.
      </p>
      <p>
        <b>Always freegle responsibly</b> - avoid contact, wash your hands, self-isolate if you're unwell or vulnerable.
        <b>If you need urgent help</b>, look at the
        <a href="https://www.nhs.uk/conditions/coronavirus-covid-19/" target="_blank" rel="noopener noreferrer">NHS website</a>.
      </p>
    </div>
    <CovidThanksModal ref="thanks" />
    <CovidInfoModal v-if="type" ref="info" :type="type" @hide="thank" />
  </div>
</template>

<script>
import CovidThanksModal from '@/components/CovidThanksModal'
import CovidInfoModal from '@/components/CovidInfoModal'
import Postcode from '@/components/Postcode'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { Postcode, CovidInfoModal, CovidThanksModal },
  mixins: [buildHead, loginOptional, waitForRef],
  data: function() {
    return {
      type: null
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
  methods: {
    offer() {
      this.record('CanHelp')
    },
    need() {
      this.record('NeedHelp')
    },
    async record(type) {
      console.log('Record', type)
      await this.$store.dispatch('misc/set', {
        key: 'covid',
        value: type
      })

      this.type = type

      if (this.myid) {
        await this.$api.covid.record(type)
        console.log('Wait')

        const settings = this.me.settings
        const pc = this.$store.getters['misc/get']('covidpc')

        if (!settings.mylocation || settings.mylocation.id !== pc) {
          settings.mylocation = pc
          await this.$store.dispatch('auth/saveAndGet', {
            settings: settings
          })
        }

        this.waitForRef('info', () => {
          console.log('Open')
          this.$refs.info.show()
        })
      } else {
        this.$store.dispatch('auth/forceLogin', true)
      }
    },
    mounted() {
      const type = this.$store.getters['misc/get']('covid')
      const me = this.$store.getters['auth/user']

      if (me && type) {
        this.record(type)
      }
    },
    thank() {
      this.waitForRef('thanks', () => {
        this.$refs.thanks.show()
      })
    },
    postcodeSelect(pc) {
      this.postcode = pc

      this.$store.dispatch('misc/set', {
        key: 'covidpc',
        value: pc
      })
    },
    postcodeClear() {
      this.postcode = null

      this.$store.dispatch('misc/set', {
        key: 'covidpc',
        value: null
      })
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
