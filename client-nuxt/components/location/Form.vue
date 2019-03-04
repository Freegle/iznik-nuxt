<template>
  <form @submit.prevent="handleSubmit(item)">
    <div class="form-group">
      <label
        for="location_name"
        class="form-control-label"
      >Name</label>
      <input
        id="location_name"
        v-model="item.name"
        :class="['form-control', isInvalid('name') ? 'is-invalid' : '']"
        type="text"
        placeholder="The name of this location."
        @input="handleUpdateField('name', $event.target.value)"
      >
      <div
        v-if="isInvalid('name')"
        class="invalid-feedback"
      >
        {{ violations.name }}
      </div>
    </div>
    <div class="form-group">
      <label
        for="location_slotsRequired"
        class="form-control-label"
      >Slots Required</label>
      <input
        id="location_slotsRequired"
        v-model="item.slotsRequired"
        :class="['form-control', isInvalid('slotsRequired') ? 'is-invalid' : '']"
        type="number"
        placeholder="The required number of slots for this location"
        @input="handleUpdateField('slotsRequired', $event.target.value)"
      >
      <div
        v-if="isInvalid('slotsRequired')"
        class="invalid-feedback"
      >
        {{ violations.slotsRequired }}
      </div>
    </div>

    <button
      type="submit"
      class="btn btn-success"
    >
      Save
    </button>
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

    violations() {
      return this.errors || {}
    }
  },

  methods: {
    isInvalid(key) {
      return Object.keys(this.violations).length > 0 && this.violations[key]
    }
  }
}
</script>
