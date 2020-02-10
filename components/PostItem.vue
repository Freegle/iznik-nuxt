<template>
  <div>
    <b-row>
      <b-col>
        <b-form-input
          :value="value"
          placeholder="In a single word or phrase, what is it?"
          maxlength="60"
          spellcheck="true"
          @input="input"
        />
      </b-col>
    </b-row>
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
      console.log(value)
      this.$emit('input', value)
    }
  }
}
</script>
