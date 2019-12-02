<template>
  <div>
    <b-textarea
      :state="validation.$dirty ? !validation.$error : null"
      :aria-describedby="feedbackId"
      v-bind="$attrs"
      v-on="$listeners"
      @blur="validation.$touch"
    />
    <b-form-invalid-feedback v-if="validation.$error" :id="feedbackId">
      <span v-if="firstValidationError">{{ firstValidationError }}</span>
    </b-form-invalid-feedback>
  </div>
</template>

<script>
import validationHelpers from '@/mixins/validationHelpers'

export default {
  mixins: [validationHelpers]
}
</script>
