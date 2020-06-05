<template>
  <div>
    <b-textarea
      :id="id"
      :state="validationState"
      :aria-describedby="feedbackId"
      v-bind="$attrs"
      v-on="$listeners"
      @blur="validation.$touch"
    />
    <b-form-invalid-feedback v-if="hasValidationError" :id="feedbackId">
      <span v-if="firstValidationError">{{ firstValidationError }}</span>
    </b-form-invalid-feedback>
  </div>
</template>

<script>
import validationFieldHelpers from '@/mixins/validationFieldHelpers'

export default {
  mixins: [validationFieldHelpers]
}
</script>
