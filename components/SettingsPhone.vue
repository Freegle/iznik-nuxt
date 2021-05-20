<template>
  <div>
    <div class="d-flex flex-wrap align-content-center">
      <b-form-group
        class="mr-2"
        :label="label"
        :description="description"
      >
        <b-input-group>
          <b-input v-model="me.phone" placeholder="Your mobile" :size="size" lazy :class="inputClass" />
          <b-input-group-append v-if="!autoSave">
            <b-button variant="white" @click="savePhone">
              <v-icon v-if="savingPhone" name="sync" class="text-success fa-spin" />
              <v-icon v-else-if="savedPhone" name="check" class="text-success" />
              <v-icon v-else name="save" />
              Save
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-btn v-if="!hideRemove && me.phone" variant="link" class="align-self-start" @click="removePhone">
        <v-icon v-if="removingPhone" name="sync" class="text-success fa-spin" />
        <v-icon v-else-if="removedPhone" name="check" class="text-success" />
        <v-icon v-else name="trash-alt" />
        Remove
      </b-btn>
    </div>
    <p v-if="notMobile" class="text-danger">
      Please enter a mobile number.
    </p>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    label: {
      type: String,
      required: false,
      default: null
    },
    description: {
      type: String,
      required: false,
      default: null
    },
    hideRemove: {
      type: Boolean,
      required: false,
      default: false
    },
    autoSave: {
      type: Boolean,
      required: false,
      default: false
    },
    inputClass: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      savingPhone: false,
      savedPhone: false,
      removingPhone: false,
      removedPhone: false
    }
  },
  computed: {
    notMobile() {
      return (
        this.me &&
        this.me.phone &&
        (this.me.phone + '').indexOf('447') !== 0 &&
        (this.me.phone + '').indexOf('07') !== 0
      )
    },
    phone() {
      return this.me && this.me.phone ? this.me.phone : null
    }
  },
  watch: {
    phone(newVal) {
      if (this.autoSave) {
        this.savePhone()
      }
    }
  },
  methods: {
    async savePhone() {
      if (!this.notMobile) {
        this.savingPhone = true

        await this.$store.dispatch('auth/saveAndGet', {
          phone: this.me.phone
        })

        this.savingPhone = false
        this.savedPhone = true
        setTimeout(() => {
          this.savedPhone = false
        }, 2000)
      }
    },
    async removePhone() {
      this.removingPhone = true

      setTimeout(() => {
        this.me.phone = null
      }, 1000)

      await this.$store.dispatch('auth/saveAndGet', {
        phone: ''
      })

      this.removingPhone = false
      this.removedPhone = true
      setTimeout(() => {
        this.removedPhone = false
      }, 2000)
    }
  }
}
</script>
