<template>
  <div>
    <b-btn
      :size="size"
      :variant="variant"
      :class="className"
      @click="confirm"
    >
      Join {{ name }}
    </b-btn>
    <ConfirmModal v-if="showConfirm" ref="joinConfirm" :title="'Join ' + name + '?'" message="You'll get emails with posts from this community, and you'll be able to reply to things you're interested in." @confirm="confirmed" />
  </div>
</template>
<script>
const ConfirmModal = () => import('./ConfirmModal')

export default {
  components: { ConfirmModal },

  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    variant: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: false,
      default: 'm-1'
    }
  },
  data() {
    return {
      showConfirm: false
    }
  },
  methods: {
    confirm() {
      this.showConfirm = true
      this.waitForRef('joinConfirm', () => {
        this.$refs.joinConfirm.show()
      })
    },
    confirmed() {
      this.$router.push('/explore/join/' + this.id)
    }
  }
}
</script>
