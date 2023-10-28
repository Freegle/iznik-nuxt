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
            <span v-if="result.period === 'Declined'">
              Gift Aid declined
            </span>
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
        <date-picker
          v-model="date"
          lang="en"
          type="date"
          format="DD/MM/YYYY"
          placeholder="Date of donation"
        />
        <SpinButton variant="white" name="save" label="Record external donation" :handler="recordDonation" class="mt-4" />
      </b-card-body>
    </b-card>

    <b-card no-body class="mb-2">
      <b-card-body>
        <p>
          You can also paste in a CSV file of donations from Xero.  The first line must be the
          headers, which must always be:
        </p>
        <p class="text-monospace">
          Date,Amt,"Name on Xero",ID / GA from Mod Tools,email address if known,"212 Reg, 213 One off",GA?,Name & Ref on bank statement
        </p>
        <b-form-textarea v-model="csv" rows="10" />
        <SpinButton variant="white" name="play" label="Validate CSV" :handler="validateCSVDonations" class="mt-4 mb-2" />
        <NoticeMessage v-if="csvError" variant="danger">
          {{ csvError }}
        </NoticeMessage>
        <!-- eslint-disable-next-line -->
        <NoticeMessage v-else-if="csvTrace" v-html="csvTrace" />
        <SpinButton
          v-if="showSubmitCSV"
          variant="white"
          name="save"
          label="Submit donations"
          :handler="submitCSVDonations"
          class="mt-4 mb-2"
        />
        <!-- eslint-disable-next-line -->
        <NoticeMessage v-if="csvTrace2" v-html="csvTrace2" />
      </b-card-body>
    </b-card>

    <ModGiftAid v-for="giftaid in giftaids" :key="'giftaid-' + giftaid.id" :giftaid="giftaid" class="mt-1" />
    <p v-if="!giftaids.length" class="mt-2 font-weight-bold">
      No gift aid to review.
    </p>
  </b-container>
</template>
<script>
import Papa from 'papaparse'
import DatePicker from 'vue2-datepicker'
import loginRequired from '@/mixins/loginRequired.js'
import NoticeMessage from '@/components/NoticeMessage'
import ModGiftAid from '../../components/ModGiftAid'
import ModHelpGiftAid from '../../components/ModHelpGiftAid'
import SpinButton from '~/components/SpinButton'
import ExternalLink from '~/components/ExternalLink'
import 'vue2-datepicker/index.css'

export default {
  components: {
    NoticeMessage,
    ModHelpGiftAid,
    ModGiftAid,
    SpinButton,
    ExternalLink,
    DatePicker
  },
  layout: 'modtools',
  mixins: [loginRequired],
  data() {
    return {
      giftaids: [],
      search: null,
      results: [],
      userid: null,
      amount: null,
      date: null,
      csv: null,
      csvError: null,
      csvTrace: null,
      csvTrace2: null,
      showSubmitCSV: false,
      csvDonations: []
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
    },
    async validateCSVDonations() {
      this.csvError = null
      this.showSubmitCSV = false
      this.csvDonations = []
      this.csvTrace = ''

      const res = Papa.parse(this.csv.trim())

      if (res.errors.length) {
        this.csvError = res.errors[0].message
        return
      }

      if (res.data?.length === 0) {
        this.csvError = 'No data found.'
        return
      }
      if (res.data[0].length !== 8) {
        this.csvError = 'Expecting 8 columns. Found ' + res.data[0].length
        return
      }

      if (res.data[0][0] !== 'Date') {
        this.csvError =
          "Expecting first column in first row to be 'Date'. Found " +
          res.data[0][0] +
          '.  Maybe you forgot the headers?'
        return
      }

      if (res.data[0][1] !== 'Amt') {
        this.csvError =
          "Expecting second column in first row to be 'Amt'. Found " +
          res.data[0][1] +
          '.  Maybe you forgot the headers?'
        return
      }

      if (res.data[0][3] !== 'ID / GA from Mod Tools') {
        this.csvError =
          "Expecting second column in first row to be 'ID / GA from Mod Tools'. Found " +
          res.data[0][1] +
          '.  Maybe you forgot the headers?'
        return
      }

      // Headers look ok.  Scan the rest of the rows.
      for (let i = 1; i < res.data.length; i++) {
        const row = res.data[i]
        if (row.length !== 8) {
          this.csvError =
            'Expecting 8 columns. Found ' + row.length + ' on row ' + (i + 1)
          break
        }
        const date = this.$dayjs(row[0], 'DD/MM/YYYY', true)
        if (!date.isValid()) {
          this.csvError = 'Invalid date ' + row[0] + ' on row ' + (i + 1)
          break
        }
        const amount = parseFloat(row[1])
        if (isNaN(amount)) {
          this.csvError = 'Invalid amount on row ' + (i + 1)
          break
        }

        const userid = parseInt(row[3].substring(3))
        if (isNaN(userid)) {
          this.csvError = 'Invalid user ID on row ' + (i + 1)
          break
        }

        // Check if the userid matches a valid user.
        await this.$store.dispatch('user/fetch', {
          id: userid
        })

        const user = this.$store.getters['user/get'](userid)

        if (!user?.id) {
          this.csvError =
            'User ID ' +
            userid +
            ' on row ' +
            (i + 1) +
            ' not found in the system.  Unsubscribed or merged?'
        }

        // Check if email found in user's emails
        let emailFound = false
        const email = row[4]
        for (let j = 0; j < user.emails.length; j++) {
          if (user.emails[j].email === email) {
            emailFound = true
            break
          }
        }

        if (!emailFound) {
          this.csvError =
            'Email ' +
            row[4] +
            ' on row ' +
            (i + 1) +
            ' not found in the emails for user ID ' +
            userid +
            '.  Perhaps this is the wrong user ID, or the email has been removed?'
          break
        }

        this.csvDonations.push({
          date: date,
          amount: amount,
          userid: userid,
          email: email
        })

        this.csvTrace +=
          date.format('YYYY-MM-DD') +
          ' £' +
          amount +
          ' from #' +
          userid +
          ' (' +
          email +
          ')<br />'
      }

      if (!this.csvError) {
        this.showSubmitCSV = true
      }
    },
    async submitCSVDonations() {
      this.csvTrace2 = ''

      for (let i = 0; i < this.csvDonations.length; i++) {
        const donation = this.csvDonations[i]

        await this.$store.dispatch('donations/add', {
          userid: donation.userid,
          amount: donation.amount,
          date: donation.date
        })

        this.csvTrace2 +=
          donation.date.format('YYYY-MM-DD') +
          ' £' +
          donation.amount +
          ' from #' +
          donation.userid +
          ' (' +
          donation.email +
          ') - recorded<br />'
      }

      this.showSubmitCSV = false
    }
  }
}
</script>
