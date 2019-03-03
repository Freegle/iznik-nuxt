<template>
  <form @submit.prevent="handleSubmit(item)">
    <div class="form-group">
      <label
        for="slot_month"
        class="form-control-label">month</label>
      <input
        id="slot_month"
        v-model="item.month"
        :class="['form-control', isInvalid('month') ? 'is-invalid' : '']"
        type="dateTime"
        placeholder="The first of the month"
        @input="handleUpdateField('month', $event.target.value)">
      <div
        v-if="isInvalid('month')"
        class="invalid-feedback">{{ violations.month }}</div>
    </div>
    <div class="form-group">
      <label
        for="slot_location"
        class="form-control-label">location</label>
      <input
        id="slot_location"
        v-model="item.location"
        :class="['form-control', isInvalid('location') ? 'is-invalid' : '']"
        type="text"
        placeholder="The location this slot is for."
        @input="handleUpdateField('location', $event.target.value)">
      <div
        v-if="isInvalid('location')"
        class="invalid-feedback">{{ violations.location }}</div>
    </div>
    <div class="form-group">
      <label
        for="slot_person"
        class="form-control-label">person</label>
      <input
        id="slot_person"
        v-model="item.person"
        :class="['form-control', isInvalid('person') ? 'is-invalid' : '']"
        type="text"
        placeholder="The person who is filling this slot, if any."
        @input="handleUpdateField('person', $event.target.value)">
      <div
        v-if="isInvalid('person')"
        class="invalid-feedback">{{ violations.person }}</div>
    </div>

    <button
      type="submit"
      class="btn btn-success">Submit</button>
  </form>
</template>

<script>
export default {
  props: {
    handleSubmit: {
      type: Function,
      required: true
    },

    handleUpdateField: {
      type: Function,
      required: true
    },

    values: {
      type: Object,
      required: true
    },

    errors: {
      type: Object,
      default: () => {}
    },

    initialValues: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    // eslint-disable-next-line
    item () {
      return this.initialValues || this.values
    },

    violations () {
      return this.errors || {}
    }
  },

  methods: {
    isInvalid (key) {
      return Object.keys(this.violations).length > 0 && this.violations[key]
    }
  }
}
</script>
