<template>
  <div class="d-flex flex-column">
    <label :for="$id('what')">What is it?</label>
    <b-form-input
      :id="$id('what')"
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
