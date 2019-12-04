<template>
  <div>
    <b-textarea
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
import validationHelpers from '@/mixins/validationHelpers'

export default {
  mixins: [validationHelpers]
}
</script>
