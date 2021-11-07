<template>
  <div>
    <Isochrone v-for="isochrone in list" :id="isochrone.id" :key="'isochrone-' + isochrone.id" />
    <b-btn v-if="!showAdd" variant="link" class="pl-0 pr-0" size="sm" @click="add">
      Add new location
    </b-btn>
    <div v-else>
      <Isochrone @added="showAdd = false" @cancel="showAdd = false" />
    </div>
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
      return this.$store.getters['isochrones/list']
    }
  },
  methods: {
    add() {
      this.showAdd = true
    }
  }
}
</script>
