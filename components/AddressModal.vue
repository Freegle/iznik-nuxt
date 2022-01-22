<template>
  <div>
    <client-only>
      <b-modal
        id="addressmodal"
        v-model="showModal"
        :title="choose ? 'Please choose an address' : 'Address Book'"
        :alt="choose ? 'Please choose an address' : 'Address Book'"
        size="lg"
        no-stacking
      >
        <template slot="default">
          <p>
            We'll store your address here so that you can easily send it to other people in future. We won't give
            it out to anyone or send you any junk mail.
          </p>
          <h4 v-if="!choose">
            Your addresses
          </h4>
          <div v-if="addressOptions && addressOptions.length">
            <p v-if="!choose">
              These are your current addresses.
            </p>
            <b-row>
              <b-col cols="12" sm="8">
                <b-select v-model="selectedAddress" :options="addressOptions" class="mb-2 font-weight-bold" />
              </b-col>
              <b-col cols="12" sm="4">
                <b-btn variant="secondary" @click="deleteIt">
                  <v-icon v-if="deleting" name="sync" class="fa-spin text-success" />
                  <v-icon v-else name="trash-alt" /> Delete
                </b-btn>
              </b-col>
            </b-row>
            <div v-if="selectedAddress">
              <b-row class="mb-2">
                <b-col cols="12" sm="8">
                  <l-map
                    v-if="showMap && selectedAddressObject"
                    ref="map"
                    :zoom="16"
                    :center="[selectedAddressObject.lat, selectedAddressObject.lng]"
                    :style="'width: 100%; height: 200px'"
                  >
                    <l-tile-layer :url="osmtile" :attribution="attribution" />
                    <l-marker :lat-lng="markerLatLng" draggable @update:latLng="updateMarker" />
                  </l-map>
                  <p class="mt-2">
                    <v-icon name="info-circle" /> Drag the marker if it's not in the right place.
                  </p>
                </b-col>
              </b-row>
              <h5>Directions</h5>
              <p>Any instructions about how to find it, or where you'll leave items.</p>
              <b-row>
                <b-col cols="12" sm="8">
                  <b-textarea v-model="instructions" rows="2" max-rows="6" class="mb-1" />
                </b-col>
                <b-col cols="12" sm="4">
                  <SpinButton
                    name="save"
                    variant="primary"
                    size="lg"
                    :handler="saveInstructions"
                    label="Save"
                    spinclass="text-white"
                  />
                </b-col>
              </b-row>
            </div>
          </div>
          <p v-else>
            You don't have any addresses yet.
          </p>
          <b-btn v-if="!showAdd" variant="secondary" class="mt-2" @click="addnew">
            <v-icon name="plus" /> Add a new address
          </b-btn>
          <div v-else>
            <h4 class="mt-2">
              Add a new address
            </h4>
            <p>Choose a postcode:</p>
            <b-row>
              <b-col>
                <Postcode focus @selected="postcodeSelect" @cleared="postcodeCleared" />
              </b-col>
            </b-row>
            <p class="mt-2">
              Choose an address:
            </p>
            <b-row v-if="propertyOptions && propertyOptions.length">
              <b-col cols="12" sm="8">
                <b-select v-model="selectedProperty" :options="propertyOptions" class="mb-2 font-weight-bold" />
              </b-col>
              <b-col cols="12" sm="4">
                <b-btn v-if="selectedProperty" variant="primary" @click="add">
                  <v-icon v-if="adding" name="sync" class="fa-spin text-success" />
                  <v-icon v-else name="plus" /> Add
                </b-btn>
              </b-col>
            </b-row>
          </div>
        </template>
        <template slot="modal-footer">
          <b-button v-if="!choose" variant="white" @click="hide">
            Close
          </b-button>
          <div v-else>
            <b-button variant="white" @click="hide">
              Cancel
            </b-button>
            <b-button variant="primary" :disabled="!selectedAddress" @click="chooseIt">
              Send this Address
            </b-button>
          </div>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import map from '@/mixins/map'
import SpinButton from './SpinButton'
import Postcode from '~/components/Postcode'

export default {
  components: {
    Postcode,
    SpinButton
  },
  mixins: [modal, map],
  props: {
    choose: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showAdd: false,
      deleting: false,
      adding: false,
      updatedInstructions: null,
      addresses: [],
      postcode: null,
      properties: {},
      selectedProperty: 0,
      showMap: false
    }
  },
  computed: {
    addressOptions() {
      const ret = []
      Object.values(this.addresses).forEach(address => {
        ret.push({
          value: address.id,
          text: address.singleline
        })
      })

      return ret
    },
    propertyOptions() {
      const ret = [
        {
          value: 0,
          text: 'Please choose your property...'
        }
      ]

      const singles = {}

      if (this.properties) {
        Object.values(this.properties).forEach(address => {
          if (!singles[address.singleline]) {
            ret.push({
              value: address.id,
              text: address.singleline
            })

            singles[address.singleline] = true
          }
        })
      }

      return ret
    },
    selectedAddress: {
      // We remember the preferred address on this device.
      get: function() {
        return this.$store.getters['address/selected']
      },
      set: function(newValue) {
        this.$store.dispatch('address/select', newValue)
      }
    },
    selectedAddressObject() {
      return this.selectedAddress ? this.addresses[this.selectedAddress] : null
    },
    markerLatLng: {
      get: function() {
        if (!this.selectedAddressObject) {
          return null
        }

        if (this.selectedAddressObject.lat || this.selectedAddressObject.lng) {
          return [
            this.selectedAddressObject.lat,
            this.selectedAddressObject.lng
          ]
        }

        return [
          this.selectedAddressObject.postcode.lat,
          this.selectedAddressObject.postcode.lng
        ]
      },
      set: function(newValue) {
        this.selectedAddressObject.lat = newValue[0]
        this.selectedAddressObject.lng = newValue[1]
      }
    },
    instructions: {
      get: function() {
        let ret = null

        if (this.selectedAddress) {
          ret = this.addresses[this.selectedAddress].instructions
        }

        return ret
      },
      set: function(newValue) {
        this.updatedInstructions = newValue
      }
    }
  },
  beforeDestroy() {
    if (this.addressWatch) {
      this.addressWatch()
    }
  },
  methods: {
    selectFirst() {
      if (
        !this.selectedAddress &&
        this.addresses &&
        this.addresses.length > 0
      ) {
        this.selectedAddress = this.addresses[0].id
        this.instructions = this.addresses[0].instructions
      } else {
        this.selectedAddress = null
        this.instructions = null
      }

      setTimeout(() => {
        this.showMap = true
      }, 100)
    },
    async show() {
      // Fetch the current addresses before opening the modal.
      await this.$store.dispatch('address/fetch')
      this.showModal = true

      // Probably because of PEBCAK, I had a problem where if you brought up the modal, changed the data, cancelled, then
      // brought it up again, the old data was still present despite the fetch that happens above being called again.
      // So we jump through some hoops with a watcher and a local property.  It'll do for now.
      // The store was updated but the computed property didn't get called again.  Perhaps it's replacing the whole
      // array?  But if that was the problem then this watch wouldn't fire.
      if (this.addressWatch) {
        this.addressWatch()
      }

      this.addresses = this.$store.getters['address/list']
      this.selectFirst()

      if (this.addresses.length === 0) {
        this.showAdd = true
      }

      this.addressWatch = this.$store.watch(
        (state, getters) => {
          return getters['address/list']
        },
        newValue => {
          this.addresses = newValue
          this.selectFirst()
        }
      )
    },
    hide() {
      this.showModal = false
      this.showAdd = false
      this.showMap = false
    },
    async add() {
      this.adding = true

      const id = await this.$store.dispatch('address/add', {
        pafid: this.selectedProperty,
        instructions: this.updatedInstructions
      })

      await this.$store.dispatch('address/fetch')
      this.selectedAddress = id

      this.adding = false
    },
    async deleteIt() {
      this.deleting = true
      await this.$store.dispatch('address/delete', {
        id: this.selectedAddress
      })
      this.deleting = false
    },
    postcodeCleared() {
      this.postcode = null
    },
    async postcodeSelect(pc) {
      this.postcode = pc

      // Fetch the postal addresses within that postcode
      await this.$store.dispatch('address/fetchProperties', {
        postcodeid: pc.id
      })

      this.properties = this.$store.getters['address/properties']
      this.selectedProperty = 0
    },
    async saveInstructions() {
      await this.$store.dispatch('address/update', {
        id: this.selectedAddress,
        instructions: this.updatedInstructions
      })
    },
    addnew() {
      this.showAdd = true
    },
    chooseIt() {
      this.$emit('chosen', this.selectedAddress)
      this.hide()
    },
    async updateMarker(val) {
      console.log('Update marker', JSON.stringify(val))
      await this.$store.dispatch('address/update', {
        id: this.selectedAddress,
        lat: val.lat,
        lng: val.lng
      })
    }
  }
}
</script>
