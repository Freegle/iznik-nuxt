<template>
  <div>
    <vue-thermometer
      :key="raised"
      :value="raised"
      :min="0"
      :max="target"
      :options="thermOptions"
      scale="£"
    />

    <h4 v-if="raised">
      &pound;{{ raised }}<br>Raised
    </h4>
  </div>
</template>
<style scoped>
/* TODO DESIGN Use CSS magic to insert a pound sign on the axis? */
/* TODO DESIGN Animate the change in value? */
</style>
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
