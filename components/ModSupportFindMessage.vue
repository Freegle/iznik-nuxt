<template>
  <div>
    <p>
      You can search for message by id, or by subject.  This will only return the first few results, so the more
      specific, the better.
    </p>
    <b-input-group>
      <b-input v-model="term" placeholder="Message id or subject" @keyup.native.enter="search" />
      <b-input-group-append>
        <SpinButton variant="success" name="search" label="Search" :handler="search" :disabled="!term" />
      </b-input-group-append>
    </b-input-group>
    <b-img-lazy v-if="busy" src="~/static/loader.gif" alt="Loading" />
    <div v-else class="mt-2">
      <ModMessage
        v-for="message in messages"
        :key="'message-' + message.id"
        :message="message"
        noactions
      />
    </div>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
import ModMessage from './ModMessage'
export default {
  components: {
    ModMessage,
    SpinButton
  },
  data: function() {
    return {
      term: null,
      busy: false
    }
  },
  computed: {
    messages() {
      return this.$store.getters['messages/getAll']
    }
  },
  methods: {
    async search() {
      this.busy = true
      const term = this.term.trim()

      console.log('Search', term)
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
        term: subj
      })
    }
  }
}
</script>
<style scoped>
input {
  max-width: 300px;
}
</style>
