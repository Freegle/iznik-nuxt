/**
 * These are helpers useful for our validation field helpers. The ones that wrap the bootstrap components.
 */
export default {
  props: {
    /**
     * The vuelidate validation object for this field.
     * Available under "$v.your.validated.field"
     * e.g. "$v.event.title"
     */
    validation: {
      type: Object,
      required: true
    },
    /**
     * We want to control whether to enable the validation to not
     * overwhelm the user as they write.
     */
    validationEnabled: {
      type: Boolean,
      default: false
    },
    /**
     * vuelidate does not help us with the messages to show, this lets us
     * specify the error message for each associated validation type, e.g:
     *
     *   {
     *     required: 'Please add a foo'
     *   }
     *
     * If you pass in a function it will pass you the vuelidate config for that
     * validation: e.g.
     *
     *   {
     *     maxLength: ({ max }) => `Please make it less than ${max}`
     *   }
     */
    validationMessages: {
      type: Object,
      required: true
    }
  },
  computed: {
    /**
     * The errors come with a nice element to show the error messages.
     * It will use this as it's id
     *
     * @returns {string}
     */
    feedbackId() {
      return this.$attrs.id + '-feedback'
    },
    /**
     * All the available validation types on this field.
     * e.g. ['required', 'maxLength']
     *
     * @returns {string[]}
     */
    validationTypes() {
      return Object.keys(this.validation).filter(k => !/^$/.test(k))
    },
    /**
     * All the validation types that have an error.
     * e.g. ['required']
     *
     * @returns {string[]}
     */
    validationErrorTypes() {
      return this.validationEnabled
        ? this.validationTypes.filter(k => !this.validation[k])
        : []
    },
    /**
     * Is there at least one error?
     *
     * @returns {true|false}
     */
    hasValidationError() {
      return this.validationEnabled && this.validation.$dirty
        ? this.validation.$error
        : false
    },
    /**
     * Useful for putting in the bootstrap :state prop
     *
     *   true  -> valid
     *   false -> invalid
     *   null  -> not validated yet, neutral
     *
     * @returns {true|false|null}
     */
    validationState() {
      return this.validationEnabled && this.validation.$dirty
        ? !this.validation.$error
        : null
    },
    /**
     * Returns the first error message if there are validation errors.
     * It's a bit overwhelming to show them all errors at once.
     * The order of how to show them if there are multiple errors
     * is detirmined by the order returned by "validationTypes".
     *
     * The messages come from the "validationMessages" prop.
     *
     * @returns {string|undefined}
     */
    firstValidationError() {
      if (this.validationErrorTypes.length > 0) {
        const type = this.validationErrorTypes[0]
        const message = this.validationMessages[type]
        return typeof message === 'function'
          ? message(this.validation.$params[type])
          : message
      }
    }
  }
}
