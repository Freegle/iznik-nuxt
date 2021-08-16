<template>
  <div v-if="false">
    <client-only>
      <NoticeMessage v-if="show" variant="danger">
        <b-btn variant="link" class="float-right" @click="hideit">
          Hide this
        </b-btn>
        <p>
          This would be a global alert.
        </p>
      </NoticeMessage>
      <div v-else class="text-danger text-right clickme" @click="showit">
        Show notice.
      </div>
    </client-only>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  computed: {
    show() {
      return !this.$store.getters['misc/get']('hideglobalwarning')
    }
  },
  methods: {
    hideit() {
      this.$store.dispatch('misc/set', {
        key: 'hideglobalwarning',
        value: true
      })
    },
    showit() {
      this.$store.dispatch('misc/set', {
        key: 'hideglobalwarning',
        value: false
      })
    }
  }
}
</script>
