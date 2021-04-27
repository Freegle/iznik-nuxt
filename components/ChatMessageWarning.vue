<template>
  <div>
    <div
      v-if="phoneNumber"
      :class="{
        'text-danger': true,
        'text-right': mine
      }"
    >
      This message may contain a phone number outside the UK, which costs more to call.
    </div>
  </div>
</template>
<script>
export default {
  props: {
    chatmessage: {
      type: Object,
      required: true
    }
  },
  computed: {
    phoneNumber() {
      let ret = false

      if (this.chatmessage && this.chatmessage.message) {
        const re = new RegExp(/\+(\d\d)[^:]/, 'gm')
        const matches = re.exec(this.chatmessage.message)

        if (matches && matches.length > 1) {
          const country = matches[1]

          if (parseInt(country) !== 44) {
            ret = true
          }
        }
      }

      return ret
    },
    mine() {
      return this.chatmessage.userid === this.me.id
    }
  }
}
</script>
