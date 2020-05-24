<template>
  <div class="d-inline-block w-100">
    <validating-form
      :class="{ 'justify-content-around': center, 'd-flex': center }"
    >
      <b-form-group
        :label="label"
        :label-for="'email-' + id"
      >
        <validating-form-input
          :value="email"
          type="email"
          name="email"
          :size="size"
          class="email"
          :validation="$v.email"
          validation-enabled
          :validation-messages="{
            email: 'Please enter a valid email address.'
          }"
          :center="center"
          autocomplete="username email"
          @input="input"
          @focus="focus"
          @blur="blur"
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
      required: false,
      defaul: null
    },
    valid: {
      type: Boolean,
      required: true
    },
    center: {
      type: Boolean,
      required: false,
      default: false
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
      suggestedDomains: [],
      focused: false
    }
  },
  watch: {
    email(newVal) {
      if (newVal && newVal.indexOf('@') !== -1) {
        //
      }

      // This check needs to be here rather than in checkState to ensure the vuelidate has got itself sorted out.
      const valid = !this.$v.email.$invalid
      this.$emit('update:valid', valid)
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
      if (email !== this.email) {
        this.$emit('update:email', email ? email.trim() : null)

        if (email && !this.focused) {
          this.$v.$touch()
        } else {
          this.$v.$reset()
        }
      }
    },
    focus() {
      this.focused = true
    },
    blur() {
      this.focused = false
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
