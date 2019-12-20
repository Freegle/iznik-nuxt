<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <div>
          <message v-if="message" ref="message" v-bind="message" :start-expanded="true" />
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </b-col>
</template>
<style scoped>
</style>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import twem from '~/assets/js/twem'

const Message = () => import('~/components/Message.vue')

export default {
  components: {
    Message
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null,
      message: null
    }
  },
  computed: {},
  watch: {
    options(newVal, oldVal) {
      if (this.filterByAnchor) {
        const { type, anchor } = this
        const regex = new RegExp(`${type}`, 'i')
        const filtered = newVal.filter(item => {
          const found = item[anchor].search(regex) !== -1
          return found
        })
        this.json = filtered
      } else {
        this.json = newVal
      }
    }
  },
  async asyncData({ app, params, store }) {
    await store.dispatch('messages/fetch', {
      id: params.id
    })

    const message = store.getters['messages/get'](params.id)

    return {
      message: message
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  head() {
    let snip = null
    const message = this.message

    if (message.snippet) {
      snip = twem.twem(this.$emoji, message.snippet)
    } else {
      snip = 'Click for more details'
    }

    return this.buildHead(
      message.subject,
      snip,
      message.attachments && message.attachments.length > 1
        ? message.attachments[0].path
        : null
    )
  }
}
</script>
