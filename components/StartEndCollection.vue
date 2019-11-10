<template>
  <div>
    <div v-for="date in editableDates" :key="'startend-' + date.uniqueid" :class="date.string && date.string.past ? 'inpast': ''">
      <StartEndDate :start="date.start" :end="date.end" :uniqueid="date.uniqueid" @remove="remove(date.uniqueid)" @change="change(date)" />
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
// TODO Validation - end date > start date, no stupidly long events (3 days?), no overlapping dates, only one blank slot.
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
    remove(uniqueid) {
      for (let i = 0; i < this.editableDates.length; i++) {
        if (this.editableDates[i].uniqueid === uniqueid) {
          this.editableDates.splice(i, 1)
        }
      }

      this.$emit('change', JSON.stringify(this.editableDates))
    },
    add() {
      this.editableDates.push({
        uniqueid: this.$store.dispatch('uniqueid/generate'),
        start: null,
        end: null,
        past: false
      })
    },
    change(date) {
      for (let i = 0; i < this.editableDates.length; i++) {
        console.log('Check', i)
        if (this.editableDates[i].uniqueid === date.uniqueid) {
          this.editableDates[i] = date
        }
      }

      this.$emit('change', JSON.stringify(this.editableDates))
    }
  }
}
</script>
