<template>
  <b-input-group class="flex">
    <b-form-input
      v-model="term"
      type="text"
      placeholder="Search email/name/id"
      :disabled="disabled"
      @keyup.native.enter="search"
    />
    <b-input-group-append>
      <b-button
        variant="success"
        :disabled="disabled"
        @click="search"
      >
        <v-icon name="search" />
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>
<script>
export default {
  props: {
    groupid: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    term: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    search() {
      // Tick to allow value to appear.
      this.$nextTick(() => {
        const url =
          '/modtools/members/approved/search/' + this.groupid + '/' + this.term
        this.$router.push(url)
      })
    }
  }
}
</script>
