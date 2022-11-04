<template>
  <div v-if="false">
    <client-only>
      <NoticeMessage v-if="show" variant="info">
        <b-btn variant="link" class="float-right" @click="hideit">
          Hide this
        </b-btn>
        <p>
          On Monday 17th, our volunteer and friend Wanda died.  She had been with Freegle since 2005, and volunteered
          countless hours to help freeglers and make the world better, with kindness and patience - both locally in
          Luton, and nationally in our Support team.  We will miss her.  Rest well, Wanda.
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
