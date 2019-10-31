<template>
  <div>
    <vue-thermometer
      :key="raised"
      :value="raised"
      :min="0"
      :max="target"
      :options="thermOptions"
      scale=""
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
      target: 2000,
      raised: 0,
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
  mounted: async function() {
    const donations = await this.$axios.get(process.env.API + '/donations')

    if (donations.status === 200 && donations.data.ret === 0) {
      this.target = Math.round(parseInt(donations.data.donations.target))
      this.raised = Math.round(parseInt(donations.data.donations.raised))
    }
  }
}
</script>
