<template>
  <b-container fluid class="bg-white">
    <ModHelpGiftAid />
    <b-card no-body class="mb-2">
      <b-card-body>
        <b-input-group>
          <b-input v-model="search" />
          <b-input-group-append>
            <SpinButton variant="white" name="search" label="Search" :handler="doSearch" />
          </b-input-group-append>
        </b-input-group>
        <div v-for="result in results" :key="result.id" class="mt-2 d-flex flex-wrap">
          <v-icon name="hashtag" class="text-muted mt-1" />{{ result.id }} {{ result.fullname }}&nbsp;
          <span v-if="result.period === 'Since'">
            Gift Aid consent for all since {{ dateonly(result.timestamp) }}
          </span>
          <span v-if="result.period === 'This'">
            Gift Aid consent for only {{ dateonly(result.timestamp) }}
          </span>
          <span v-if="result.period === 'Future'">
            Gift Aid consent for all future from {{ dateonly(result.timestamp) }}
          </span>
          &nbsp;{{ result.homeaddress }}
        </div>
      </b-card-body>
    </b-card>
    <ModGiftAid v-for="giftaid in giftaids" :key="'giftaid-' + giftaid.id" :giftaid="giftaid" class="mt-1" />
    <p v-if="!giftaids.length">
      No gift aid to review.
    </p>
  </b-container>
</template>

<script>
import loginRequired from '@/mixins/loginRequired.js'
import ModGiftAid from '../../components/ModGiftAid'
import ModHelpGiftAid from '../../components/ModHelpGiftAid'
import SpinButton from '~/components/SpinButton'

export default {
  components: { ModHelpGiftAid, ModGiftAid, SpinButton },
  layout: 'modtools',
  mixins: [loginRequired],
  data() {
    return {
      giftaids: [],
      search: null,
      results: []
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
    },
    async doSearch() {
      this.results = await this.$api.giftaid.search(this.search)
    }
  }
}
</script>
