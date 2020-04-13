<template>
  <div>
    <b-input-group>
      <b-input v-model="term" placeholder="Message id/subject" @keyup.native.enter="search" />
      <b-input-group-append>
        <SpinButton variant="success" name="search" label="Search" :handler="search" :disabled="!term" />
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

      await this.$store.dispatch('messages/clear')

      if (!isNaN(term)) {
        // This is a raw message id
        await this.searchById(term)
      } else if (term.substring(0, 1) === '#' && !isNaN(term.substring(1))) {
        // This is a #id
        await this.searchById(term.substring(1))
      } else {
        this.searchBySubject(this.term)
      }

      this.busy = false
    },
    async searchById(id) {
      await this.$store.dispatch('messages/fetch', {
        id: id,
        messagehistory: true
      })
    },
    async searchBySubject(subj) {
      await this.$store.dispatch('messages/search', {
        term: subj,
        groupid: this.groupid
      })
    }
  }
}
</script>
<style scoped>
input {
  max-width: 320px;
}
</style>
