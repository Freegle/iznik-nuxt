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
                <b-btn variant="white" @click="deleteIt">
                  <v-icon v-if="deleting" name="sync" class="fa-spin text-success" />
                  <v-icon v-else name="trash-alt" /> Delete
                </b-btn>
              </b-col>
            </b-row>
            <div v-if="selectedAddress">
              <h5>Directions</h5>
              <p>Any instructions about how to find it, or where you'll leave items.</p>
              <b-row>
                <b-col cols="12" sm="8">
                  <b-textarea v-model="instructions" rows="2" max-rows="6" class="mb-1" />
                </b-col>
                <b-col cols="12" sm="4">
                  <b-btn variant="white" @click="saveInstructions">
                    <v-icon v-if="instructing" name="sync" class="fa-spin text-success" />
                    <v-icon v-else name="save" /> Save
                  </b-btn>
                </b-col>
              </b-row>
            </div>
          </div>
          <p v-else>
            You don't have any addresses yet.
          </p>
          <b-btn v-if="!showAdd" variant="primary" class="mt-2" @click="addnew">
            <v-icon name="plus" /> Add a new address
          </b-btn>
          <div v-else>
            <h4 class="mt-2">
              Add a new address
            </h4>
            <p>Choose a postcode:</p>
            <b-row>
              <b-col>
                <!--              TODO DESIGN Postcode is center-aligned, which looks wrong.-->
                <Postcode @selected="postcodeSelect" @cleared="postcodeCleared" />
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
                <b-btn v-if="selectedProperty" variant="white" @click="add">
                  <v-icon v-if="adding" name="sync" class="fa-spin text-success" />
                  <v-icon v-else name="plus" /> Add
                </b-btn>
              </b-col>
            </b-row>
          </div>
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button v-if="!choose" variant="white" @click="cancel">
            Close
          </b-button>
          <div v-else>
            <b-button variant="white" @click="cancel">
              Cancel
            </b-button>
            <b-button variant="success" :disabled="!selectedAddress" @click="chooseIt">
              Send this Address
            </b-button>
          </div>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
const Postcode = () => import('~/components/Postcode')

export default {
  components: {
    Postcode
  },
  props: {
    choose: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showModal: false,
      showAdd: false,
      deleting: false,
      adding: false,
      updatedInstructions: null,
      instructing: false,
      addresses: [],
      postcode: null,
      properties: {},
      selectedProperty: 0
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

      if (this.properties) {
        Object.values(this.properties).forEach(address => {
          ret.push({
            value: address.id,
            text: address.singleline
          })
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
      } else {
        this.selectedAddress = null
      }
    },
    async show() {
      // Fetch the current addresses before opening the modal.
      await this.$store.dispatch('address/fetch')
      this.showModal = true

      // See AvailabilityModal for explanation.
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
    },
    async add() {
      this.adding = true
      console.log('Add', this.selectedProperty)

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
      this.instructing = true

      await this.$store.dispatch('address/update', {
        id: this.selectedAddress,
        instructions: this.updatedInstructions
      })

      this.instructing = false
    },
    addnew() {
      this.showAdd = true
    },
    chooseIt() {
      this.$emit('chosen', this.selectedAddress)
      this.hide()
    }
  }
}
</script>
