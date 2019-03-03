<template>
  <form @submit.prevent="handleSubmit(item)">
    <div class="form-group">
      <label
        for="person_name"
        class="form-control-label">name</label>
      <input
        id="person_name"
        v-model="item.name"
        :class="['form-control', isInvalid('name') ? 'is-invalid' : '']"
        type="text"
        placeholder="The name of this person."
        @input="handleUpdateField('name', $event.target.value)">
      <div
        v-if="isInvalid('name')"
        class="invalid-feedback">{{ violations.name }}</div>
    </div>
    <div class="form-group">
      <label
        for="person_slots"
        class="form-control-label">slots</label>
      <input
        id="person_slots"
        v-model="item.slots"
        :class="['form-control', isInvalid('slots') ? 'is-invalid' : '']"
        type="text"
        placeholder="The slots in which this person is currently appearing, or blank."
        @input="handleUpdateField('slots', $event.target.value)">
      <div
        v-if="isInvalid('slots')"
        class="invalid-feedback">{{ violations.slots }}</div>
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
