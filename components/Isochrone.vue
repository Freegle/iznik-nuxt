<template>
  <div>
    <div v-if="!id">
      <hr>
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
              Travel time: <span v-if="myLocation" class="text-faded"> (from {{ myLocation.name }})</span>
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
          <b-btn variant="white" size="sm" class="mr-2" title="Show nearer posts" @click="decrement">
            <v-icon name="minus" />
            <span class="d-none d-md-inline-block">Near</span>
          </b-btn>
          <b-input
            v-model="minutes"
            type="range"
            :min="minMinutes"
            :max="maxMinutes"
            :step="step"
            class="pt-2"
            @change="changeMinutes"
          />
          <b-btn variant="white" size="sm" class="ml-2" title="Show further posts" @click="increment">
            <span class="d-none d-md-inline-block">Far</span>
            <v-icon name="plus" />
          </b-btn>
        </div>
        <label class="font-weight-bold travelLabel">
          Travel by:
        </label>
        <div class="travel">
          <b-btn :variant="isochrone.transport === 'Walk' ? 'primary' : 'white'" @click="changeTransport('Walk')">
            <v-icon name="walking" /><span class="d-none d-md-inline-block">&nbsp;Walk</span>
          </b-btn>
          <b-btn :variant="isochrone.transport === 'Cycle' ? 'primary' : 'white'" @click="changeTransport('Cycle')">
            <v-icon name="bicycle" /><span class="d-none d-md-inline-block">&nbsp;Cycle</span>
          </b-btn>
          <b-btn :variant="isochrone.transport === 'Drive' ? 'primary' : 'white'" @click="changeTransport('Drive')">
            <v-icon name="car" /><span class="d-none d-md-inline-block">&nbsp;Drive</span>
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
      minMinutes: 5,
      maxMinutes: 45,
      transport: null,
      pc: null,
      nickname: null,
      step: 5
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
  created() {
    if (this.id) {
      this.minutes = this.$store.getters['isochrones/get'](this.id).minutes
    } else {
      this.minutes = 25
    }
  },
  methods: {
    increment() {
      this.minutes = Math.min(this.minutes + this.step, this.maxMinutes)
      this.changeMinutes(this.minutes)
    },
    decrement() {
      this.minutes = Math.max(this.minutes - this.step, this.minMinutes)
      this.changeMinutes(this.minutes)
    },
    changeMinutes(newVal) {
      if (this.id) {
        this.$store.dispatch('isochrones/edit', {
          id: this.id,
          minutes: this.minutes,
          transport: this.isochrone.transport
        })
      }
    },
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
  grid-template-colums: auto auto;

  .sliderLabel {
    grid-row: 1 / 2;
    grid-column: 1 / 3;
    display: flex;
    justify-content: flex-start;
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
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    display: flex;
    justify-content: flex-end;
    margin-left: 1rem;
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
    }
  }
}
</style>
