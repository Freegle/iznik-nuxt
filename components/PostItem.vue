<template>
  <div>
    <b-form-input
      :value="value"
      placeholder="In a single word or phrase, what is it?"
      maxlength="60"
      spellcheck="true"
      size="lg"
      @input="input"
    />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    input(value) {
      this.$emit('input', value)
    }
  }
}
</script>
