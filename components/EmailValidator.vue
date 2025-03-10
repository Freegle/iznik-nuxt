<template>
  <div class="d-flex flex-column">
    <b-form-group
      :label="label"
      :label-for="'email-' + uniqueid"
      label-class="mt-0"
    >
      <validating-form-input
        :id="'email-' + uniqueid"
        :value="email"
        type="email"
        name="email"
        :size="size"
        :min-length="1"
        class="email"
        :validation="$v.email"
        validation-enabled
        :validation-messages="{
          email: 'Please enter a valid email address.'
        }"
        :center="center"
        autocomplete="username email"
        placeholder="Email address"
        @input="input"
        @focus="focus"
        @blur="blur"
      />
    </b-form-group>
    <div v-if="suggestedDomains && suggestedDomains.length" class="text-info small mb-2">
      Did you mean <strong>{{ suggestedDomains[0] }}</strong>?
    </div>
    <div v-if="email && email.indexOf('privaterelay.appleid.com') !== -1" class="text-muted small mb-3">
      This means you use your Apple ID to log in.
    </div>
  </div>
</template>

<script>
import { required, email as emailValidation } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import validationHelpers from '@/mixins/validationHelpers'
import ValidatingFormInput from '../components/ValidatingFormInput'

function emailFormatter(value) {
  if (!value) return value
  return value.toLowerCase()
}

export default {
  components: { ValidatingFormInput },
  mixins: [validationMixin, validationHelpers],
  props: {
    email: {
      type: String,
      required: false,
      default: null
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
      focused: false,
      uniqueid: ''
    }
  },
  watch: {
    email: {
      immediate: true,
      async handler(newVal) {
        if (newVal && newVal.indexOf('@') !== -1) {
          // Ask the server to spot typos in this domain.
          const domain = newVal.substring(newVal.indexOf('@') + 1)

          // Wait for the first dot, as that will be long enough that we don't thrash the server.
          if (domain.indexOf('.') !== -1) {
            this.suggestedDomains = []
            const ret = await this.$axios.get(process.env.API + '/domains', {
              params: {
                domain: domain
              }
            })

            if (ret && ret.data && ret.data.ret === 0) {
              this.suggestedDomains = ret.data.suggestions
            }
          }
        }

        // This check needs to be here rather than in checkState to ensure the vuelidate has got itself sorted out.
        const valid = !this.$v.email.$invalid
        this.$emit('update:valid', valid)
      }
    }
  },
  async mounted() {
    this.checkState(this.email)

    this.uniqueid = await this.$store.dispatch('uniqueid/generate')
  },
  methods: {
    input(newVal) {
      this.checkState(newVal)
    },
    checkState(email) {
      if (email !== this.email) {
        // Emitting a null or '' value does not trigger an update of the prop in the parent.  I don't know whether
        // this is intentional, but the consequence is that the email appears to remain valid.  By emitting a space
        // we at least trigger this component to update and notice that the email is not valid.
        this.$emit('update:email', email ? email.trim() : ' ')

        if (email && !this.focused) {
          this.$v.$touch()
        } else {
          this.$v.$reset()

          // Signal that the email is no longer valid.  The watch doesn't get called to make this happen, so you
          // can end up with an empty email by typing one, then selecting and deleting it.
          this.$emit('update:valid', false)
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
    email: {
      required,
      email: val => emailValidation(emailFormatter(val))
    }
  }
}
</script>

<style scoped>
.email {
  width: 100%;
  max-width: 480px;
}
</style>
