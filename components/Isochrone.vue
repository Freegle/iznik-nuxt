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
          <b-form-input v-model="nickname" placeholder="Where is this?" max-length="20" />
        </div>
      </div>
    </div>
    <template v-if="isochrone">
      <div class="layout">
        <label class="font-weight-bold sliderLabel">
          <div v-if="id">
            <div v-if="isochrone.nickname">
              Travel time from {{ isochrone.nickname }}: <span class="text-faded">({{ isochrone.location.name }})</span>
            </div>
            <div v-else>
              Travel time: <span class="text-faded"> (from {{ myLocation.name }})</span>
            </div>
          </div>
          <div v-else>
            Travel time:
          </div>
          <div class="d-flex flex-column justify-content-around">
            <b-btn v-if="addButton" variant="link" class="ml-2 p-0" size="sm" @click="$emit('add')">
              Add location
            </b-btn>
            <SpinButton
              v-else-if="isochrone.nickname"
              variant="link"
              button-class="ml-2 p-0 mb-1"
              :handler="remove"
              confirm
              size="sm"
              label="Remove"
            />
          </div>
        </label>
        <div class="slider">
          <span class="mr-2">Near</span>
          <b-input
            v-model="minutes"
            type="range"
            min="5"
            max="45"
            step="5"
          />
          <span class="ml-2">Far</span>
        </div>
        <label class="font-weight-bold travelLabel">
          Travel by:
        </label>
        <div class="travel">
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
      <div v-if="!id">
        <b-btn v-if="showAdd" variant="primary" size="lg" class="mt-2" @click="add">
          Add location
        </b-btn>
        <b-btn v-else variant="secondary" size="lg" class="mt-2" @click="$emit('cancel')">
          Cancel
        </b-btn>
      </div>
      <hr v-if="!last" class="text-muted mb-1 mt-1">
    </template>
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
    },
    addButton: {
      type: Boolean,
      required: false,
      default: false
    },
    last: {
      type: Boolean,
      required: false,
      default: false
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
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.layout {
  display: grid;

  grid-template-rows: auto auto auto auto;
  grid-template-colums: auto;

  .sliderLabel {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    display: flex;
    justify-content: space-between;
  }

  .slider {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
    display: flex;
  }

  .travelLabel {
    grid-row: 3 / 4;
    grid-column: 1 / 2;
    display: none;
  }

  .travel {
    grid-row: 4 / 5;
    grid-column: 1 / 2;
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 0.25rem;
  }

  @include media-breakpoint-up(md) {
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 50px;

    .sliderLabel {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      display: flex;
      justify-content: space-between;
    }

    .slider {
      grid-row: 2 / 3;
      grid-column: 1 / 2;
      display: flex;
    }

    .travelLabel {
      grid-row: 1 / 2;
      grid-column: 2 / 3;
      display: flex;
      justify-content: flex-end;
    }

    .travel {
      grid-row: 2 / 3;
      grid-column: 2 / 3;
      display: flex;
      justify-content: flex-end;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}
</style>
