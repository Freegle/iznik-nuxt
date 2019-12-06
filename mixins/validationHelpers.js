/**
 * This is a mixin for the form you want to validate.
 *
 * It does not include vuelidate, so include that too in your form component.
 */
import get from 'lodash.get'
export default {
  computed: {
    validationEnabled() {
      return this.$v.$dirty
    }
  },
  methods: {
    /**
     * Finds, scrolls to, and focuses the first error on a form.
     *
     * This relies on a convention for setting "ref" attributes on form fields.
     *
     * If you are validating the nested field `eventEdit.title`
     * the corresponding ref would be `eventEdit__title`.
     *
     * It is expected to put this on a form group wrapper element,
     * rather than the input element itself.
     *
     * We then find this ref, scroll to it, and focus any input or textarea.
     */
    validationFocusFirstError() {
      const error = this.$v
        .$flattenParams()
        .map(({ path }) => ({
          path,
          validator: get(this.$v, path),
          ref: this.$refs[path.join('__')]
        }))
        .find(({ ref, validator }) => ref && validator.$error)
      if (!error) return
      const { ref } = error
      const el = ref.$el
      el.scrollIntoView()
      const focusEl = el.querySelector('input, textarea')
      if (focusEl) {
        focusEl.focus()
      }
    }
  }
}
