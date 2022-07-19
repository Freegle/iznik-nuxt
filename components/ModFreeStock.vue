<template>
  <div>
    <NoticeMessage v-if="show" variant="success border-primary shadow bg-white">
      <p>
        <strong>FreeStock 2022</strong> - a bunch of Freegle volunteers getting together in a field for a natter from
        <strong>12th to 14th August</strong>.  Come and say hi (if only for a day)!  There will be cake.
      </p>
      <p>
        It's at Hertford Camping and Caravanning Club Site 7 - a spacious, quiet one.  We know this location won't work for everyone, but
        no location will.
        We've booked a safari tent as a headquarters - and we can offer sleeping room in this for a few people if you
        need it - please let us know.
      </p>
      <p v-if="amComing" class="text-primary font-weight-bold">
        Great, you've said you're coming.
      </p>
      <p v-if="amDay" class="text-primary font-weight-bold">
        Great, you've said you're popping by one day.
      </p>
      <div class="mt-2 d-flex flex-wrap">
        <SpinButton
          variant="primary"
          class="mr-4"
          name="check"
          label="Yes, I've booked"
          :handler="coming"
          spinclass="text-white"
        />
        <SpinButton
          variant="primary"
          class="mr-4"
          name="check"
          label="I'll pop in for a day"
          :handler="dayvisitor"
          spinclass="text-white"
        />
        <ExternalLink href="https://discourse.ilovefreegle.org/t/freestock-2022">
          <b-btn variant="secondary" class="mr-4">
            Find out More
          </b-btn>
        </ExternalLink>
        <SpinButton
          variant="warning"
          class="mr-4"
          name="times"
          label="Not for me, thanks"
          :handler="nope"
        />
      </div>
    </NoticeMessage>
    <b-btn v-else variant="link" @click="show=true">
      Show FreeStock info
    </b-btn>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import SpinButton from './SpinButton'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { NoticeMessage, ExternalLink, SpinButton },
  data: function() {
    return {
      show: false
    }
  },
  computed: {
    amComing() {
      return this.me?.settings?.freestock2022
    },
    amDay() {
      return this.me?.settings?.freestock2022day
    }
  },
  async mounted() {
    await this.fetchMe(['me', 'aboutme'])

    const settings = this.me.settings

    if (
      (!('freestock2022' in settings) && !('freestock2022day' in settings)) ||
      settings.freestock2022 === true ||
      settings.freestock2022day === true
    ) {
      this.show = true
    }
  },
  methods: {
    coming() {
      this.saveSetting('freestock2022', true)
      this.saveSetting('freestock2022day', false)
    },
    dayvisitor() {
      this.saveSetting('freestock2022', false)
      this.saveSetting('freestock2022day', true)
    },
    nope() {
      this.saveSetting('freestock2022', false)
      this.saveSetting('freestock2022day', false)
      this.show = false
    },
    async saveSetting(name, val) {
      const settings = this.me.settings
      settings[name] = val
      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.shadow {
  margin: 10px;
  box-shadow: 0px 0px 4px 1px $color-gray--dark;
}
</style>
