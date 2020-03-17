<template>
  <div class="d-flex justify-content-center">
    <div class="disclaimer__container px-3 bg-white">
      <h1 class="text-center">
        COVID-19 - Can you help?
      </h1>
      <p>
        Over the next couple of months, quite a lot of people may be ill and need help with practical things like
        shopping and medicines.  Maybe not yet, but maybe soon.
      </p>
      <p>
        Maybe you can help.  Maybe you
        (or someone you know) will need help.  Let's see if we can connect people so that we're ready.
      </p>
      <b-row>
        <b-col cols="12" md="8" offset-md="2">
          <div class="d-flex justify-content-between w-100 mb-2">
            <b-btn variant="success" size="lg" class="mr-3" @click="offer">
              <v-icon name="hand-holding-heart" /> I can help
            </b-btn>
            <b-btn variant="primary" size="lg" @click="need">
              <v-icon name="cart-plus" /> I need help
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
        in touch safely - that would be a good problem to have.
      </p>
      <p>
        We won't pass on your details before
        getting back in touch with you.  If you need urgent help, look at the
        <!-- eslint-disable-next-line -->
        <a href="https://www.nhs.uk/conditions/coronavirus-covid-19/" target="_blank" rel="noopener noreferrer">NHS website</a>.
      </p>
    </div>
    <CovidModal ref="thanks" />
  </div>
</template>

<script>
import CovidModal from '../components/CovidModal'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { CovidModal },
  mixins: [buildHead, loginOptional, waitForRef],
  data: function() {
    return {}
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
      if (this.myid) {
        await this.$api.covid.record(type)
        this.waitForRef('thanks', () => {
          this.$refs.thanks.show()
        })
      } else {
        await this.$store.dispatch('misc/set', {
          key: 'covid',
          value: type
        })

        console.log('Force login')
        this.$store.dispatch('auth/forceLogin', true)
      }
    },
    mounted() {
      const type = this.$store.getters['misc/get']('covid')
      const me = this.$store.getters['auth/user']
      console.log('Mounted', type, me)

      if (me && type) {
        this.record(type)
      }
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
