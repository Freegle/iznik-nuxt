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
      <CovidWarning />
    </div>
    <CovidThanksModal ref="thanks" />
    <CovidInfoModal v-if="type" ref="info" :type="type" @hide="thank" />
  </div>
</template>

<script>
import CovidWarning from '../../components/CovidWarning'
import NoticeMessage from '../../components/NoticeMessage'
import CovidThanksModal from '@/components/CovidThanksModal'
import CovidInfoModal from '@/components/CovidInfoModal'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { NoticeMessage, CovidWarning, CovidInfoModal, CovidThanksModal },
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
        await this.$store.dispatch('covid/record', {
          type
        })

        const settings = this.me.settings
        const pc = this.$store.getters['misc/get']('covidpc')

        if (!settings.mylocation || settings.mylocation.id !== pc) {
          settings.mylocation = pc
          await this.$store.dispatch('auth/saveAndGet', {
            settings: settings
          })
        }

        this.waitForRef('info', () => {
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
