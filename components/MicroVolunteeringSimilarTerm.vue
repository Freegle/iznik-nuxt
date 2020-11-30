<template>
  <div>
    <b-btn v-if="similar" class="selected" variant="white" size="lg" @click="$emit('not')">
      <b>{{ term.term }}</b>
    </b-btn>
    <b-btn v-else class="unselected" variant="white" size="lg" @click="$emit('similar')">
      <b>{{ term.term }}</b>
    </b-btn>
  </div>
</template>
<script>
export default {
  props: {
    term: {
      type: Object,
      required: true
    },
    similarTerms: {
      type: Array,
      required: true
    }
  },
  computed: {
    similar() {
      return this.similarTerms.find(t => t.id === this.term.id)
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.selected {
  background-color: $colour-secondary !important;
  border-color: $color-blue--dark !important;
  color: $color-white !important;
}

.unselected {
  background-color: $color-white !important;
  border-color: $color-green--dark !important;
  color: $color-black !important;
}
</style>
