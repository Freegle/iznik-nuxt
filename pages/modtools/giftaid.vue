<template>
  <b-container fluid class="bg-white">
    <ModHelpGiftAid />
    <ModGiftAid v-for="giftaid in giftaids" :key="'giftaid-' + giftaid.id" :giftaid="giftaid" class="mt-1" />
  </b-container>
</template>

<script>
import loginRequired from '@/mixins/loginRequired.js'
import ModGiftAid from '../../components/ModGiftAid'
import ModHelpGiftAid from '../../components/ModHelpGiftAid'

export default {
  components: { ModHelpGiftAid, ModGiftAid },
  layout: 'modtools',
  mixins: [loginRequired],
  data() {
    return {
      giftaids: []
    }
  },
  async mounted() {
    await this.getGiftAid()
  },
  methods: {
    async getGiftAid() {
      const giftaid = await this.$api.giftaid.list()

      // Sort so that the easy ones are at the top.
      this.giftaids = giftaid.sort((a, b) => {
        if (
          (a.postcode && !b.postcode) ||
          (a.fullname.indexOf(' ') !== -1 && b.fullname.indexOf(' ') === -1)
        ) {
          return -1
        } else if (
          (b.postcode && !a.postcode) ||
          (b.fullname.indexOf(' ') !== -1 && a.fullname.indexOf(' ') === -1)
        ) {
          return 1
        } else {
          return 0
        }
      })
    }
  }
}
</script>
