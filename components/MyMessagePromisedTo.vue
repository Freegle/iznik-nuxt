<template>
  <div>
    <div class="d-flex flex-wrap">
      <div v-if="promise.id === myid">
        <!--                        This can happen with TN.  It means it's promised, but we don't know who to.-->
        <v-icon name="handshake" class="fa-fw mt-1" />&nbsp;Promised
      </div>
      <div v-else>
        <!-- eslint-disable-next-line-->
        <v-icon name="handshake" class="fa-fw mt-1" />&nbsp;Promised to <strong>{{ promise.name }}</strong><span v-if="promise.trystdate">,</span>
      </div>
      <div v-if="promise.trystdate" class="d-flex">
        handover <span class="d-none d-md-inline">arranged for</span><strong>&nbsp;{{ promise.trystdate }}</strong>
      </div>
    </div>
    <div v-if="promise.tryst" class="d-flex flex-wrap small">
      <AddToCalendar :ics="promise.tryst.ics" variant="link" />
      <b-btn variant="link" @click="changeTime">
        <v-icon name="pen" />
        Change time
      </b-btn>
      <PromiseModal ref="promiseModalChange" :messages="[ message ]" :selected-message="message.id" :users="replyusers" :selected-user="promisee" />
    </div>
  </div>
</template>
<script>
import PromiseModal from '~/components/PromiseModal'
import AddToCalendar from '~/components/AddToCalendar'

export default {
  components: { PromiseModal, AddToCalendar },
  props: {
    promise: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    replyusers: {
      type: Array,
      required: true
    }
  },
  computed: {
    promisee() {
      let ret = null

      console.log('Trst', this.promise)
      if (this.promise.tryst) {
        if (this.promise.tryst.user1 === this.myid) {
          ret = this.promise.tryst.user2
        } else {
          ret = this.promise.tryst.user1
        }
      }

      return ret
    }
  },
  methods: {
    changeTime(e) {
      console.log('Change', this.$refs)
      e.preventDefault()
      e.stopPropagation()
      this.$refs.promiseModalChange.show()
    }
  }
}
</script>
