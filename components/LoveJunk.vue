<template>
  <a v-if="me && me.lovejunk" @click="click">
    <b-card-img v-observe-visibility="visible" :src="src" fluid class="clickme" />
  </a>
</template>
<script>
export default {
  props: {
    variant: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      shown: false
    }
  },
  computed: {
    src() {
      return this.variant === 'mobile'
        ? 'lovejunk/mobile.jpg'
        : 'lovejunk/desktop.jpg'
    }
  },
  methods: {
    visible() {
      if (!this.shown) {
        this.shown = true

        this.$api.bandit.shown({
          uid: 'lovejunk',
          variant: this.variant
        })
      }
    },
    async click() {
      await this.$api.bandit.chosen({
        uid: 'lovejunk',
        variant: this.variant
      })

      window.open('https://www.lovejunk.com/rubbish-clearance/')
    }
  }
}
</script>
