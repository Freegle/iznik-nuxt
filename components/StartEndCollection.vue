<template>
  <div>
    <div v-for="(date, idx) in value" :key="date.uniqueid" :class="date.string && date.string.past ? 'inpast': ''">
      <StartEndDate v-model="value[idx]" @remove="remove(date)" />
    </div>
    <b-btn variant="white" class="mt-1" @click="add">
      <v-icon name="plus" /> Add <span v-if="value.length > 0">another</span><span v-else>a</span> date
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
import StartEndDate from '~/components/StartEndDate'

export default {
  components: {
    StartEndDate
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    addDateIfEmpty: {
      type: Boolean,
      default: false
    }
  },
  async mounted() {
    if (this.value.length === 0 && this.addDateIfEmpty) {
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
