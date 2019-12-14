<template>
  <form v-bind="$attrs" v-on="$listeners">
    <slot />
  </form>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

form ::v-deep {
  label,
  .col-form-label {
    font-weight: bold;
    color: $color-green--darker;
    margin-top: 10px;
  }

  .is-invalid label,
  .is-invalid .col-form-label {
    color: $form-feedback-invalid-color;
  }

  .form-group.is-invalid .invalid-feedback {
    display: block;
  }
}
</style>
