<template>
  <div class="d-inline-block w-100">
    <validating-form>
      <b-form-group
        :label="label"
        :label-for="'email-' + id"
      >
        <validating-form-input
          ref="email"
          :value="email"
          type="email"
          :size="size"
          class="email"
          :validation="$v.email"
          validation-enabled
          :validation-messages="{
            email: 'Not a valid email address...yet!'
          }"
          @input="input"
        />
      </b-form-group>
    </validating-form>
  </div>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import ValidatingForm from '../components/ValidatingForm'
import ValidatingFormInput from '../components/ValidatingFormInput'
import validationHelpers from '@/mixins/validationHelpers'

export default {
  components: { ValidatingForm, ValidatingFormInput },
  mixins: [validationMixin, validationHelpers],
  props: {
    email: {
      type: String,
      required: false
    },
    valid: {
      type: Boolean,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    },
    id: {
      type: String,
      required: false,
      default: ''
    },
    label: {
      type: String,
      required: false,
      default: "What's your email address?"
    }
  },
  data: function() {
    return {
      suggestedDomains: []
    }
  },
  watch: {
    email(newVal) {
      if (newVal && newVal.indexOf('@') !== -1) {
        //
      }
      console.log('Email now', newVal)
    }
  },
  mounted() {
    this.checkState(this.email)
  },
  methods: {
    input(newVal) {
      this.checkState(newVal)
    },
    checkState(email) {
      this.$emit('update:email', email ? email.trim() : null)
      console.log('Set dirty')
      this.$v.$touch()
      console.log('Set ok', this.$v.email.$invalid)
      this.$nextTick(() => {
        const valid = !this.$v.email.$invalid
        console.log('Check state', email, valid)
        this.$emit('update:valid', valid)
      })
    }
  },
  validations: {
    email: { required, email }
  }
}
</script>
<style scoped>
.email {
  width: 100%;
  max-width: 480px;
}
</style>
