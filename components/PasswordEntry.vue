<template>
  <b-form-group
    label="Your password:"
    label-for="password"
    class="font-weight-bold"
  >
    <b-input-group id="input-password">
      <b-input
        id="password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Your password"
        class="password__input"
        @input="$emit('update:password', $event)"
      />
      <span class="password__focus-element" />
      <b-input-group-append>
        <b-button variant="white" class="transbord" title="Show password" :aria-label="showPassword ? 'hide password' : 'show password'" @click="togglePassword">
          <v-icon v-if="showPassword" title="Hide password" class="text-secondary" flip="horizontal">
            <v-icon name="eye" />
            <v-icon name="slash" />
          </v-icon>
          <v-icon v-else name="eye" class="text-secondary" />
        </b-button>
      </b-input-group-append>
      <b-input-group-append v-if="showSaveOption">
        <SpinButton variant="white" aria-label="Save password" name="save" label="Save" :handler="savePassword" />
      </b-input-group-append>
    </b-input-group>
  </b-form-group>
</template>

<script>
import SpinButton from './SpinButton'

export default {
  components: {
    SpinButton
  },
  props: {
    originalPassword: {
      type: String,
      required: false,
      default: ''
    },
    showSaveOption: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      password: null,
      showPassword: false
    }
  },
  mounted() {
    this.password = this.originalPassword
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    async savePassword() {
      if (this.password) {
        await this.$store.dispatch('auth/saveAndGet', {
          password: this.password
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

/* These classes are to give the complete password group of elements a focus indicator */
/* when the individual password input element gets focus.  It should not display for the */
/* other two individual elements */
.password__input:focus {
  /* Get rid of any default focus on the password input element added by bootstrap */
  box-shadow: none;
  border-right-color: $color-black;
}

.password__input:focus + .password__focus-element {
  /* Add bootstrap style focus to the span element.  This element should encompass */
  /* the whole password group */
  position: absolute;
  height: 100%;
  width: 100%;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  border-radius: 3px;
}
</style>
