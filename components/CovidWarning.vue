<template>
  <NoticeMessage variant="danger">
    <p>
      <b>Very sadly, Freegle has suspended OFFER/WANTED posts due to COVID-19.</b>
    </p>
    <p>
      If possible, please hold on to your stuff and post it when we re-open.  There will be
      a lot of people who are struggling and will need things when that happens.  We’ll email you
      when we’re back.
    </p>
    <p>
      Freegle also needs your help.  We are funded mostly from donations given by freeglers - no freegling means we
      won’t be getting donations.  Lots of charities and businesses will be struggling, but if you want us to
      be here for you in six months’ time then please set up a regular donation:

      <DonationButton link="paypal1" show="£1/month" monthly class="mt-2" />
    </p>
    <p>
      Our <nuxt-link to="/chitchat">
        ChitChat section
      </nuxt-link> is staying open.  Join us here to swap hints,
      tips and tell others how you’re filling your day.  Share your knowledge and questions on upcycling, reuse,
      crafts, gardening, cooking, hobbies etc.
    </p>
    <p>
      See you on the other side!
    </p>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import DonationButton from './DonationButton'
export default {
  components: { DonationButton, NoticeMessage }
}
</script>
