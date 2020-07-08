<template>
  <div v-if="!hide">
    <b-row>
      <b-col cols="6" md="3" class="pl-3">
        <div>
          <b-input v-model="giftaid.fullname" :class="{ 'border-danger': nameInvalid }" />
          <div v-if="email">
            <!-- eslint-disable-next-line -->
            <a :href="'mailto:' + email + '?subject=A question about your Gift Aid declaration'"><v-icon name="envelope" />&nbsp;{{ email }}</a>
          </div>
          <span class="small text-muted">
            {{ giftaid.timestamp | timeago }}
            <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ giftaid.userid }}
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
        <SpinButton variant="success" name="check" label="Looks Good" :handler="reviewed" />
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

export default {
  components: { SpinButton },
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
    }
  }
}
</script>
