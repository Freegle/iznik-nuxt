<template>
  <div>
    <div v-for="(date, idx) in value" :key="date.uniqueid" :class="date.string && date.string.past ? 'inpast': ''">
      <StartEndDate v-model="value[idx]" @remove="remove(date)" />
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
import StartEndDate from '~/components/StartEndDate'

export default {
  components: {
    StartEndDate
  },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  async mounted() {
    if (this.value.length === 0) {
      this.value.push({
        uniqueid: await this.$store.dispatch('uniqueid/generate'),
        start: null,
        end: null,
        past: false
      })
    }
  },
  methods: {
    remove(item) {
      const idx = this.value.indexOf(item)
      if (idx !== -1) this.value.splice(idx, 1)
    },
    async add() {
      this.value.push({
        uniqueid: await this.$store.dispatch('uniqueid/generate'),
        start: null,
        end: null,
        past: false
      })
    }
  }
}
</script>
