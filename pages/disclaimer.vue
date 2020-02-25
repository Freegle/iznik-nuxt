<template>
  <div class="d-flex justify-content-center">
    <div class="disclaimer__container px-3 bg-white">
      <h1 class="text-center">
        Disclaimer
      </h1>
      <p>
        Freegle puts people who have unwanted items in touch with people who want those items. Because of how it works,
        Freegle never sees or checks items and they may not be in working order. Posting an advert or responding to
        an advert does not guarantee you will be able to get rid of unwanted items or get the items you want. Any
        agreement you reach about any items will be between the person requesting or advertising items and you.
      </p>
      <p>
        It is your responsibility to ensure you are not breaking any laws in offering or getting goods through Freegle.
        When something can be reused for its original purpose, freegling it is fine (it's what we're for!) but if it
        would legally count as waste (e.g. a mixture of low economic value which would require sorting), you must not
        freegle it. If in doubt, check <a href="https://www.gov.uk/government/publications/legal-definition-of-waste-guidance/decide-if-a-material-is-waste-or-not#decide-if-your-material-is-waste" target="_blank" rel="noopener">here</a>.
      </p>
      <h2>Safety</h2>
      <p>
        Freeglers are lovely.  But many of them will be people you've never met before.  So please use common sense when
        posting to Freegle or collecting an item.  For example:
      </p>
      <ol>
        <li>Don't post in public on Freegle telling people when you're going to be out.</li>
        <li>Most collections occur at home, but if you're worried about that, arrange to meet in a cafe or other public place.</li>
        <li>Please ensure your property is physically safe for people who collect from you, as we all have a duty of care towards others.</li>
      </ol>
      <h2>Scams</h2>
      <p>
        Regrettably, occasionally online scammers target Freegle, often by offering high-value items, and then
        asking you to pay for courier charges.  We catch a lot of these, and you never see them, but sometimes they sneak through.
      </p>
      <p>
        While some communities allow postage, you should never hand over money in advance.  We don't recommend any
        specific courier (so if you see a message saying we do, it’s a scam).
      </p>
      <p>
        If you are unlucky enough to be scammed, please report it to the
        <a href="http://www.actionfraud.police.uk/" target="_blank" rel="noopener">Police</a>, and
        <nuxt-link to="/help">
          to us
        </nuxt-link>.
      </p>
    </div>
  </div>
</template>

<script>
import buildHead from '@/mixins/buildHead.js'

export default {
  mixins: [buildHead],
  head() {
    return this.buildHead(
      'Disclaimer',
      'What you need to know when using Freegle.'
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
