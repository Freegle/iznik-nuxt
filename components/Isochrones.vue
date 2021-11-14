<template>
  <div>
    <Isochrone
      v-for="(isochrone, ix) in list"
      :id="isochrone.id"
      :key="'isochrone-' + isochrone.id"
      :add-button="ix === 0"
      :last="ix === list.length - 1"
      @add="showAdd = true"
    />
    <Isochrone v-if="showAdd" @added="showAdd = false" @cancel="showAdd = false" />
  </div>
</template>
<script>
import Isochrone from '@/components/Isochrone'
export default {
  components: {
    Isochrone
  },
  data: function() {
    return {
      showAdd: false
    }
  },
  computed: {
    list() {
      return Object.values(this.$store.getters['isochrones/list'])
    }
  },
  methods: {
    add() {
      this.showAdd = true
    }
  }
}
</script>
