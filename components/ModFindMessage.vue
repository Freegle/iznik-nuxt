<template>
  <div>
    <b-input-group>
      <b-input v-model="term" placeholder="Message id/subject" @keyup.native.enter="search" />
      <b-input-group-append>
        <SpinButton
          variant="success"
          name="search"
          label="Search"
          spinclass="text-white"
          :handler="search"
          :disabled="!term"
        />
      </b-input-group-append>
    </b-input-group>
    <NoticeMessage v-if="error" class="mt-2" variant="warning">
      Couldn't fetch that message.  Almost always this is because the message doesn't exist (or has been very deleted).
    </NoticeMessage>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
import NoticeMessage from './NoticeMessage'

export default {
  components: {
    NoticeMessage,
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
      busy: false,
      error: false
    }
  },
  methods: {
    async search() {
      this.busy = true
      this.error = false
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
      this.busy = true
      this.error = false

      try {
        await this.$store.dispatch('messages/fetch', {
          id: id,
          messagehistory: true
        })
      } catch (e) {
        console.log("Couldn't fetch", e)
        this.error = true
      }

      this.busy = false
    },
    async searchBySubject(subj) {
      this.busy = true
      this.error = false

      await this.$store.dispatch('messages/search', {
        term: subj,
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
