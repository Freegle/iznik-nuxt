<template>
  <b-card no-body>
    <b-card-header class="bg-info">
      Postcode Tester
    </b-card-header>
    <b-card-body>
      <p>
        You can see which community and area a postcode will map to. <b>Postcode changes within an area you
          change should take effect immediately, but ones outside the areas may may take overnight
          before postcode mapping is updated.</b>
      </p>
      <Postcode :find="false" @selected="postcodeSelect" />
      <div v-if="postcode" class="mt-2">
        <p class="font-weight-bold">
          Community:
        </p>
        <p v-if="postcode.groupsnear && postcode.groupsnear.length">
          {{ postcode.groupsnear[0].namedisplay }}
        </p>
        <p v-else>
          No community found
        </p>
        <p class="font-weight-bold">
          Area:
        </p>
        <p v-if="postcode.area">
          {{ postcode.area.name }}
        </p>
        <p v-else>
          No area found
        </p>
      </div>
    </b-card-body>
  </b-card>
</template>
<script>
import Postcode from '~/components/Postcode'
export default {
  components: {
    Postcode
  },
  data: function() {
    return {
      postcode: null
    }
  },
  methods: {
    postcodeSelect(pc) {
      this.postcode = pc
    }
  }
}
</script>
