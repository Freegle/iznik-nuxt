<template>
  <div v-if="false">
    <client-only>
      <NoticeMessage v-if="show" variant="info">
        <b-btn variant="link" class="float-right" @click="hideit">
          Hide this
        </b-btn>
        <p>
          Emails are disrupted for some people at the moment, as things settle down after moving our servers to new
          hosting.  Please check your spam folder if you're not getting emails, and mark any there as not spam.  If you're expecting
          replies, please check occasionally on the website/app in case email hasn't got through.
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
  data: function() {
    return {
      key: 1
    }
  },
  computed: {
    show() {
      return !this.$store.getters['misc/get']('hideglobalwarning' + this.key)
    }
  },
  methods: {
    hideit() {
      this.$store.dispatch('misc/set', {
        key: 'hideglobalwarning' + this.key,
        value: true
      })
    },
    showit() {
      this.$store.dispatch('misc/set', {
        key: 'hideglobalwarning' + this.key,
        value: false
      })
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .notice {
  background: black !important;
  color: white !important;
}

::v-deep button {
  color: white !important;
}
</style>
