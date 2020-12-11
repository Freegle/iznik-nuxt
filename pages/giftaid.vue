<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1" />
      <b-col cols="12" lg="6" class="bg-white">
        <h1>Gift Aid for Freegle</h1>
        <p>
          Your kind donation will go even further if we can claim Gift Aid on it.  Please fill out this form
          if you are able.
        </p>
        <b-form-group
          id="fullnamelabel"
          label="Your full (real) name"
          label-for="fullname"
          label-class="label"
        >
          <div v-if="me && me.displayname && !fullname && me.displayname.indexOf(' ') !== -1">
            <b-btn variant="secondary" class="mb-2" @click="fullname = me.displayname">
              Click here to use <b>{{ me.displayname }}</b>
            </b-btn>
          </div>
          <p>
            Or type here:
          </p>
          <b-form-input
            id="fullname"
            v-model="fullname"
            name="fullname"
            autocomplete="given-name"
            placeholder="Your full name"
            :class="{ 'border-warning': nameInvalid, 'mb-3': true }"
          />
        </b-form-group>
        <b-form-group
          id="homeaddresslabel"
          label="Your home address"
          label-for="homeaddress"
          label-class="label"
        >
          <div v-for="address in addresses" :key="'address-' + address.id">
            <div v-if="!homeaddress">
              <b-btn variant="secondary" class="mb-2" @click="homeaddress = address.multiline">
                Click here to use <b>{{ address.singleline }}</b>
              </b-btn>
            </div>
          </div>
          <p>
            Or type here.  <b>Please include a postcode.</b>
          </p>
          <b-textarea
            id="homeaddress"
            v-model="homeaddress"
            rows="4"
            name="homeaddress"
            placeholder="Your home address"
            :class="{ 'border-warning': addressInvalid, 'mb-3': true }"
          />
        </b-form-group>
        <b-form-group
          id="periodlabel"
          label="This declaration covers"
          label-for="period"
          label-class="label"
        >
          <b-form-radio v-model="period" name="period" value="Since">
            All donations in the last five years
          </b-form-radio>
          <b-form-radio v-model="period" name="period" value="This">
            Just this donation
          </b-form-radio>
          <b-form-radio v-model="period" name="period" value="Future">
            This and all future donations
          </b-form-radio>
        </b-form-group>
        <NoticeMessage class="info">
          By submitting this declaration I confirm that I am a UK taxpayer and understand that if I pay less Income
          Tax and/or Capital Gains Tax in the current tax year than the amount of Gift Aid claimed on all my donations
          it is my responsibility to pay any
          difference.
        </NoticeMessage>
        <SpinButton
          name="save"
          size="lg"
          variant="success"
          label="Submit Gift Aid Declaration"
          class="mt-4"
          :handler="save"
          :disabled="!valid"
        />
        <NoticeMessage v-if="saved" variant="primary" class="mt-2">
          Thank you.  We have saved your Gift Aid Declaration.  It's very kind of you to help keep Freegle going.
        </NoticeMessage>
        <hr>
        <div class="small mt-2">
          <p>
            Please return to this page and amend your details if you:
          </p>
          <ul>
            <li>Want to cancel this declaration</li>
            <li>Change your name or home address</li>
            <li>No longer pay sufficient tax on your income and/or capital gains.</li>
          </ul>
          <SpinButton
            v-if="valid"
            name="trash-alt"
            size="lg"
            variant="white"
            label="Remove Gift Aid Consent"
            class="mt-2 mb-2"
            :handler="remove"
          />
        </div>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1" />
    </b-row>
  </b-container>
</template>

<script>
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
import waitForRef from '@/mixins/waitForRef'
import SpinButton from '../components/SpinButton'
import NoticeMessage from '../components/NoticeMessage'

export default {
  components: { SpinButton, NoticeMessage },
  mixins: [loginRequired, buildHead, waitForRef],
  data() {
    return {
      period: 'Since',
      fullname: null,
      homeaddress: null,
      addresses: [],
      saved: false
    }
  },
  computed: {
    valid() {
      return this.period && this.fullname && this.homeaddress
    },
    nameInvalid() {
      return !this.fullname || this.fullname.indexOf(' ') === -1
    },
    addressInvalid() {
      return !this.homeaddress || this.homeaddress.indexOf(' ') === -1
    }
  },
  async mounted() {
    await this.getGiftAid()
    await this.$store.dispatch('address/fetch')
    this.addresses = this.$store.getters['address/list']
  },
  methods: {
    async getGiftAid() {
      const giftaid = await this.$api.giftaid.get()

      if (giftaid) {
        this.period = giftaid.period
        this.fullname = giftaid.fullname
        this.homeaddress = giftaid.homeaddress
      }
    },
    async save() {
      await this.$api.giftaid.save({
        period: this.period,
        fullname: this.fullname,
        homeaddress: this.homeaddress
      })

      this.saved = true
    },
    async remove() {
      await this.$api.giftaid.remove()
      this.period = 'Since'
      this.fullname = null
      this.homeaddress = null
    }
  },
  head() {
    return this.buildHead(
      'Gift Aid',
      'Add gift aid to your donation to Freegle'
    )
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

::v-deep .label {
  font-weight: bold;
  color: $color-green--darker;
}
</style>
