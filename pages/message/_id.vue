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
const Message = () => import('~/components/Message.vue')

export default {
  components: {
    Message
  },
  mixins: [loginOptional],
  data: function() {
    return {
      id: null,
      message: null
    }
  },
  computed: {},
  async asyncData({ app, params, store }) {
    console.log('Fetch message', params.id)
    await store.dispatch('messages/fetch', {
      id: params.id
    })

    const message = store.getters['messages/get'](params.id)

    // console.log('Fetch user', message.fromuser)
    // message.fromuser = await store.dispatch('user/fetch', {
    //   id: message.fromuser.id,
    //   info: true
    // })

    return {
      message: message
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  methods: {}
}
</script>
