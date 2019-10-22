<template>
  <div>
    <div v-for="(date, index) in dates" :key="'startend-' + index" :class="date.string && date.string.past ? 'inpast': ''">
      <StartEndDate :start="date.start" :end="date.end" :index="index" @remove="remove(index)" @change="change" />
    </div>
    <b-btn variant="white" class="mt-1" @click="add">
      <v-icon name="plus" /> Add another date
    </b-btn>
  </div>
</template>
<style scoped>
.inpast {
  text-decoration: line-through;
  color: #6c757d70;
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
  methods: {
    remove(index) {
      if (this.dates.length > 1) {
        this.dates.splice(index, 1)
        this.$emit('changed', this.dates)
      }
    },
    add() {
      this.dates.push({
        start: null,
        end: null,
        past: false
      })
    },
    change(index, date) {
      this.dates[index] = date
      this.$emit('change', this.dates)
    }
  }
}
</script>
