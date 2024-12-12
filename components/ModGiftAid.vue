<template>
  <div v-if="!hide">
    <b-row>
      <b-col cols="6" md="3" class="pl-3">
        <div>
          <b-input v-model="giftaid.fullname" :class="{ 'border-danger': nameInvalid }" />
          <div v-if="email">
            <!-- eslint-disable-next-line -->
            <ExternalLink :href="'mailto:' + email + '?subject=A question about your Gift Aid declaration'"><v-icon name="envelope" />&nbsp;{{ email }}</ExternalLink>
          </div>
          <NoticeMessage v-if="giftaid.donations" variant="info">
            Total donations &pound;{{ giftaid.donations }}
          </NoticeMessage>
          <NoticeMessage v-else variant="danger">
            No donations found - check in case they are using multiple email addresses and you need to merge the accounts.
            You can't approve this until
            it's linked to a donation - but you could click Give Up if you can't manage to.
          </NoticeMessage>
          <span class="small text-muted">
            {{ timeago(giftaid.timestamp) }}
            User ID <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ giftaid.userid }}
            Gift Aid ID <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ giftaid.id }}
          </span>
        </div>
      </b-col>
      <b-col cols="6" md="5">
        <b-textarea v-model="giftaid.homeaddress" rows="4" />
        <b-input v-model="giftaid.housenameornumber" :class="{ 'border-danger': houseInvalid, 'mt-1': true }" placeholder="House name or number" />
        <b-input v-model="giftaid.postcode" :class="{ 'border-danger': postcodeInvalid, 'mt-1': true }" placeholder="Postcode" />
      </b-col>
      <b-col cols="6" md="4" class="d-flex justify-content-between">
        <SpinButton variant="white" name="save" label="Save Changes" :handler="save" />
        <SpinButton variant="warning" name="trash-alt" label="Give Up" :handler="giveup" confirm />
        <SpinButton variant="success" name="check" label="Looks Good" :handler="reviewed" :disabled="houseInvalid || postcodeInvalid || nameInvalid || !giftaid.donations" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <hr>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
import NoticeMessage from './NoticeMessage'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { SpinButton, ExternalLink, NoticeMessage },
  props: {
    giftaid: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      hide: false
    }
  },
  computed: {
    nameInvalid() {
      return this.giftaid.fullname.indexOf(' ') === -1
    },
    postcodeInvalid() {
      return !this.giftaid.postcode || this.giftaid.postcode.indexOf(' ') === -1
    },
    houseInvalid() {
      return !this.giftaid.housenameornumber
    },
    email() {
      let email = null

      if (this.giftaid.email) {
        this.giftaid.email.forEach(e => {
          if (!e.ourdomain && (e.preferred || email === null)) {
            email = e.email
          }
        })
      }

      return email
    }
  },
  methods: {
    save() {
      const {
        id,
        period,
        fullname,
        homeaddress,
        postcode,
        housenameornumber
      } = this.giftaid
      this.$api.giftaid.edit(
        id,
        period,
        fullname,
        homeaddress,
        postcode,
        housenameornumber,
        false
      )
    },
    reviewed() {
      this.$api.giftaid.edit(
        this.giftaid.id,
        null,
        null,
        null,
        null,
        null,
        true
      )
      this.hide = true
    },
    giveup() {
      if (!this.giftaid.donations) {
        // Approve these as a way of getting them off the list even though they're not linked to a donation.
        this.reviewed()
      } else {
        this.$api.giftaid.edit(
          this.giftaid.id,
          null,
          null,
          null,
          null,
          null,
          false,
          true
        )
        this.hide = true
      }
    }
  }
}
</script>
