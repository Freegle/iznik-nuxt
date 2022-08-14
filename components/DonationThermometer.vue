<template>
  <div>
    <vue-thermometer
      :key="raised"
      :value="raised"
      :min="0"
      :max="max"
      :options="thermOptions"
      scale="£"
    />

    <h4 v-if="raised">
      &pound;{{ raised }}<br>Raised
    </h4>
  </div>
</template>
<script>
export default {
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      thermOptions: {
        thermo: {
          color: 'darkgreen',
          backgroundColor: 'white',
          frameColor: 'black',
          ticks: 11,
          ticksEnabled: true,
          tickColor: 'black',
          tickWidth: '1'
        }
      }
    }
  },
  computed: {
    max() {
      // If we've raised more than the target, stretch it a bit.
      if (this.raised > this.target) {
        let max = this.raised * 1.1

        if (max > 500) {
          max = Math.round((max + 0.5) / 500) * 500
        }

        return max
      } else {
        return this.target
      }
    },
    target() {
      return this.$store.getters['donations/target']
    },
    raised() {
      return this.$store.getters['donations/raised']
    }
  },
  mounted: async function() {
    await this.$store.dispatch('donations/fetch', {
      groupid: this.groupid
    })
  }
}
</script>
