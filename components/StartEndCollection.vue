<template>
  <div>
    <div v-for="(date, index) in editableDates" :key="'startend-' + index" :class="date.string && date.string.past ? 'inpast': ''">
      <StartEndDate :start="date.start" :end="date.end" :index="index" @remove="remove(index)" @change="change" />
    </div>
    <b-btn variant="white" class="mt-1" @click="add">
      <v-icon name="plus" /> Add another date
    </b-btn>
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

.inpast {
  text-decoration: line-through;
  color: $color-gray--faded;
}
</style>

<script>
// TODO Validation - end date > start date, no stupidly long events (3 days?), no overlapping dates.
// TODO This code could do with a bit of extra testing - various combinations of add/edit/cancel/delete etc.
const StartEndDate = () => import('~/components/StartEndDate')

export default {
  components: {
    StartEndDate
  },
  props: {
    dates: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      editableDates: []
    }
  },
  mounted: function() {
    this.editableDates = this.dates ? this.dates : []
  },
  methods: {
    remove(index) {
      if (this.editableDates.length > 1) {
        this.editableDates.splice(index, 1)
        this.$emit('changed', this.editableDates)
      }
    },
    add() {
      console.log('Add another date')
      this.editableDates.push({
        start: null,
        end: null,
        past: false
      })
    },
    change(index, date) {
      this.editableDates[index] = date
      this.$emit('change', this.editableDates)
    }
  }
}
</script>
