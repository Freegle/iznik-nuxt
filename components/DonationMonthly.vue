<template>
  <div class="clickme" @click="submit">
    <b-img-lazy src="~/static/donate_per_month.jpg" alt="Click to support Freegle by donating £1 per month" class="w-100" title="Click here to set up a £1/month donation to Freegle.  Thank you!" />
    <form ref="donateform" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" class="d-none">
      <input type="hidden" name="cmd" value="_s-xclick">
      <input type="hidden" name="hosted_button_id" value="6VJKBWQ9RQHPU">
      <input type="hidden" name="os0" value="Supporter1">
      <input type="hidden" name="on0" value="">
      <input type="hidden" name="currency_code" value="GBP">
      <img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">
    </form>
  </div>
</template>
<script>
export default {
  props: {
    variant: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.$api.bandit.shown({
      uid: 'donationmonthy',
      variant: this.variant
    })
  },
  methods: {
    async submit() {
      await this.$api.bandit.chosen({
        uid: 'donationmonthy',
        variant: this.variant
      })

      this.$refs.donateform.submit()
    }
  }
}
</script>
