export default {
  props: {
    validation: {
      type: Object,
      required: true
    },
    validationMessages: {
      type: Object,
      required: true
    }
  },
  computed: {
    feedbackId() {
      return this.$attrs.id + '-feedback'
    },
    validationTypes() {
      return Object.keys(this.validation).filter(k => !/^$/.test(k))
    },
    validationErrors() {
      return this.validationTypes.filter(k => !this.validation[k])
    },
    firstValidationError() {
      const type = this.validationErrors[0]
      if (!type) return
      const message = this.validationMessages[type]
      return typeof message === 'function'
        ? message(this.validation.$params[type])
        : message
    }
  }
}
