/**
 * This is a mixin for the form you want to validate.
 *
 * It does not include vuelidate, so include that too in your form component.
 */
export default {
  computed: {
    validationEnabled() {
      return this.$v.$dirty
    }
  },
  methods: {
    validationFocusFirstError() {
      const el = this.$refs.form
      if (!el) return // no ref :/
      // We want to scroll to the form group, so the label is visible
      const scrollToEl = el.querySelector('.is-invalid')
      // ... but focus the first input field
      const focusEl = el.querySelector('input.is-invalid, textarea.is-invalid')
      if (scrollToEl) scrollToEl.scrollIntoView()
      if (focusEl) {
        if (!scrollToEl) {
          // we can make do with scrolling to the input
          focusEl.scrollIntoView()
        }
        focusEl.focus()
      } else if (!scrollToEl) {
        // nothing else found, just scroll to the form itself...
        el.scrollIntoView()
      }
      return scrollToEl || focusEl
    }
  }
}
