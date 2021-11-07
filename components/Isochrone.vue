<template>
  <div>
    <div v-if="!id">
      <p>
        You can add extra postcodes, and we'll show you the posts from near there too.
      </p>
      <div class="d-flex flex-wrap justify-content-between mb-2">
        <div>
          <label class="font-weight-bold">
            New Postcode:
          </label>
          <Postcode v-if="!id" :value="pcname" size="sm" @selected="selectPostcode" @cleared="clearPostcode" />
        </div>
        <div>
          <label class="font-weight-bold">
            Nickname (e.g. Work):
          </label>
          <b-form-input v-model="nickname" placeholder="Where is this?" />
        </div>
      </div>
    </div>
    <div v-if="isochrone" class="d-flex justify-content-between align-items-center">
      <div class="flex-column justify-content-between">
        <label class="font-weight-bold">
          <div v-if="id">
            <div v-if="isochrone.nickname">
              Distance from {{ isochrone.nickname }} <span class="text-muted">({{ isochrone.location.name }})</span>:
            </div>
            <div v-else>
              Distance: <span class="text-faded"> (from {{ myLocation.name }})</span>
            </div>
          </div>
          <div v-else>
            Distance to show:
          </div>
        </label>
        <div class="d-flex">
          <label class="font-weight-bold mr-2">Near</label>
          <b-input
            v-model="minutes"
            type="range"
            min="5"
            max="45"
            step="5"
          />
          <label class="ml-2 font-weight-bold">Far</label>
        </div>
        <SpinButton
          v-if="isochrone.nickname"
          variant="link"
          class="pl-0 pr-0"
          :handler="remove"
          confirm
          size="sm"
          label="Remove"
        />
      </div>
      <div>
        <label class="font-weight-bold">
          Travelling by:
        </label>
        <div>
          <b-btn :variant="isochrone.transport === 'Walk' ? 'primary' : 'white'" @click="changeTransport('Walk')">
            <v-icon name="walking" /> Walk
          </b-btn>
          <b-btn :variant="isochrone.transport === 'Cycle' ? 'primary' : 'white'" @click="changeTransport('Cycle')">
            <v-icon name="bicycle" /> Cycle
          </b-btn>
          <b-btn :variant="isochrone.transport === 'Drive' ? 'primary' : 'white'" @click="changeTransport('Drive')">
            <v-icon name="car" /> Drive
          </b-btn>
        </div>
      </div>
    </div>
    <div v-if="!id">
      <b-btn v-if="showAdd" variant="primary" size="lg" class="mt-2" @click="add">
        Add location
      </b-btn>
      <b-btn v-else variant="secondary" size="lg" class="mt-2" @click="$emit('cancel')">
        Cancel
      </b-btn>
    </div>
    <hr class="text-muted">
  </div>
</template>
<script>
import Postcode from '~/components/Postcode'
import SpinButton from '~/components/SpinButton'

export default {
  components: {
    Postcode,
    SpinButton
  },
  props: {
    id: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      minutes: null,
      transport: null,
      pc: null,
      nickname: null
    }
  },
  computed: {
    pcname() {
      return this.pc ? this.pc.name : ''
    },
    isochrone() {
      if (this.id) {
        return this.$store.getters['isochrones/get'](this.id)
      } else {
        return {
          minutes: this.minutes,
          transport: this.transport
        }
      }
    },
    list() {
      return this.$store.getters['isochrones/list']
    },
    showAdd() {
      let ret = false

      if (
        !this.id &&
        this.pc &&
        this.minutes &&
        this.transport &&
        this.nickname
      ) {
        // Check the postcode doesn't already appear.
        ret = true

        Object.values(this.list).forEach(i => {
          if (i.location.name === this.pc) {
            ret = false
          }
        })
      }

      return ret
    }
  },
  watch: {
    minutes(newVal) {
      this.$store.dispatch('isochrones/edit', {
        id: this.id,
        minutes: this.minutes,
        transport: this.isochrone.tranport
      })
    }
  },
  created() {
    if (this.id) {
      this.minutes = this.$store.getters['isochrones/get'](this.id).minutes
    } else {
      this.minutes = 25
    }
  },
  methods: {
    changeTransport(type) {
      if (this.id) {
        this.$store.dispatch('isochrones/edit', {
          id: this.id,
          minutes: this.minutes,
          transport: type
        })
      } else {
        this.transport = type
      }
    },
    selectPostcode(pc) {
      this.pc = pc
    },
    clearPostcode() {
      this.pc = null
    },
    async add() {
      await this.$store.dispatch('isochrones/add', {
        minutes: this.minutes,
        transport: this.transport,
        locationid: this.pc.id,
        nickname: this.nickname
      })

      this.minutes = 25
      this.transport = null
      this.pc = null
      this.nickname = null
      this.$emit('added')
    },
    remove() {
      this.$store.dispatch('isochrones/delete', {
        id: this.id
      })
    }
  }
}
</script>
