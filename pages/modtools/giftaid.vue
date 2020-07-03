<template>
  <b-container fluid class="bg-white">
    <ModHelpGiftAid />
    <ModGiftAid v-for="giftaid in giftaids" :key="'giftaid-' + giftaid.id" :giftaid="giftaid" class="mt-1" />
  </b-container>
</template>

<script>
import ModGiftAid from '../../components/ModGiftAid'
import ModHelpGiftAid from '../../components/ModHelpGiftAid'
import loginRequired from '@/mixins/loginRequired.js'

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
      this.giftaids = await this.$api.giftaid.list()
    }
  }
}
</script>
