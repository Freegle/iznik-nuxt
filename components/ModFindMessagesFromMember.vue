<template>
  <div>
    <b-input-group>
      <b-input v-model="term" placeholder="Email address/name" @keyup.native.enter="search" />
      <b-input-group-append>
        <SpinButton
          variant="primary"
          name="search"
          label="Search"
          spinclass="text-white"
          :handler="search"
          :disabled="!term"
        />
      </b-input-group-append>
    </b-input-group>
  </div>
</template>
<script>
import SpinButton from './SpinButton'

export default {
  components: {
    SpinButton
  },
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      term: null,
      busy: false
    }
  },
  methods: {
    async search() {
      this.busy = true
      const term = this.term.trim()
      this.$emit('searched', term)

      await this.$store.dispatch('messages/clear')

      await this.$store.dispatch('messages/searchMember', {
        term: term,
        groupid: this.groupid
      })

      this.busy = false
    }
  }
}
</script>
<style scoped>
input {
  max-width: 320px;
}
</style>
