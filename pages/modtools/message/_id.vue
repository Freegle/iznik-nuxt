<template>
  <div>
    <client-only>
      <ModMessage v-if="message" :message="message" />
    </client-only>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired'
import ModMessage from '@/components/ModMessage'

export default {
  components: {
    ModMessage
  },
  layout: 'modtools',
  mixins: [loginRequired],
  data: function() {
    return {
      id: null
    }
  },
  computed: {
    message() {
      if (this.id) {
        return this.$store.getters['messages/get'](this.id)
      }

      return null
    }
  },
  async mounted() {
    await this.$store.dispatch('messages/fetch', {
      id: this.id
    })
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
