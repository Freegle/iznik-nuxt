<template>
  <b-container fluid class="bg-white">
    <ModHelpGiftAid />
    <b-card no-body class="mb-2">
      <b-card-body>
        <p>
          You can search for existing Gift Aid details by someone's name or address.
        </p>
        <b-input-group>
          <b-input v-model="search" placeholder="Search for gift aid record" @keyup="checkSearch" />
          <b-input-group-append>
            <SpinButton variant="white" name="search" label="Search" :handler="doSearch" />
          </b-input-group-append>
        </b-input-group>
        <div v-for="result in results" :key="result.id" class="mt-2">
          <div class="d-flex flex-wrap">
            Gift aid ID&nbsp;<v-icon name="hashtag" class="text-muted mt-1" />{{ result.id }}
            {{ result.fullname }}&nbsp;
            (<ExternalLink :href="'mailto:' + result.email" class="text-muted small mt-1 mr-1 ml-1">
              {{ result.email }}
            </ExternalLink>)
            user ID&nbsp;<v-icon name="hashtag" class="text-muted mt-1" />{{ result.userid }}
            -&nbsp;
            <span v-if="result.period === 'Since'">
              Gift Aid consent for all since {{ dateonly(result.timestamp) }}
            </span>
            <span v-if="result.period === 'This'">
              Gift Aid consent for only {{ dateonly(result.timestamp) }}
            </span>
            <span v-if="result.period === 'Future'">
              Gift Aid consent for all future from {{ dateonly(result.timestamp) }}
            </span>
            <span v-if="result.period === 'Past4YearsAndFuture'">
              Gift Aid consent for four years before {{ dateonly(result.timestamp) }} and all future.
            </span>
            &nbsp;{{ result.homeaddress }}
          </div>
          <div v-for="d in result.donations" :key="'donation-' + d.id" class="pl-4 small">
            &bull;&nbsp;&pound;{{ d.GrossAmount }} on {{ dateshort(d.timestamp ) }} <span class="small text-muted">via {{ d.source }}</span>
            <span v-if="d.source === 'PayPalGivingFund' || d.source === 'eBay' || d.source === 'Facebook'" class="small text-muted">
              (Gift Aid claimed by them not us)
            </span>
          </div>
        </div>
      </b-card-body>
    </b-card>

    <b-card no-body class="mb-2">
      <b-card-body>
        <p>
          You can record a donation which wasn't made via PayPal, e.g. a bank transfer or cheque.  Please use this
          carefully.  A manual thank you will be requested (not just for larger amounts), a Supporter Badge will be
          added, and the user will be prompted to complete a Gift Aid form if appropriate.
        </p>
        <b-input v-model="userid" type="number" placeholder="User's ID from Support Tools" class="mt-2" />
        <b-input v-model="amount" type="number" placeholder="Amount e.g. 1.50. No pound sign" class="mt-2" />
        <b-input v-model="date" type="date" placeholder="Date of donation" class="mt-2" />
        <SpinButton variant="white" name="save" label="Record external donation" :handler="recordDonation" class="mt-4" />
      </b-card-body>
    </b-card>

    <ModGiftAid v-for="giftaid in giftaids" :key="'giftaid-' + giftaid.id" :giftaid="giftaid" class="mt-1" />
    <p v-if="!giftaids.length" class="mt-2 font-weight-bold">
      No gift aid to review.
    </p>
  </b-container>
</template>

<script>
import loginRequired from '@/mixins/loginRequired.js'
import ModGiftAid from '../../components/ModGiftAid'
import ModHelpGiftAid from '../../components/ModHelpGiftAid'
import SpinButton from '~/components/SpinButton'
import ExternalLink from '~/components/ExternalLink'

export default {
  components: { ModHelpGiftAid, ModGiftAid, SpinButton, ExternalLink },
  layout: 'modtools',
  mixins: [loginRequired],
  data() {
    return {
      giftaids: [],
      search: null,
      results: [],
      userid: null,
      amount: null,
      date: null
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
    },
    checkSearch(e) {
      if (e.keyCode === 13) {
        this.doSearch()
      }
    },
    recordDonation() {
      if (this.userid && this.amount > 0 && this.date) {
        this.$store.dispatch('donations/add', {
          userid: this.userid,
          amount: this.amount,
          date: this.date
        })
      }
    }
  }
}
</script>
