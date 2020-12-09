<template>
  <div>
    <b-btn variant="white" @click="mergeMember">
      <v-icon name="equals" /> Merge
    </b-btn>
    <ModMergeMemberModal ref="mergemodal" />
  </div>
</template>
<script>
import waitForRef from '@/mixins/waitForRef'
import ModMergeMemberModal from './ModMergeMemberModal'

export default {
  components: { ModMergeMemberModal },
  mixins: [waitForRef],
  methods: {
    mergeMember() {
      this.waitForRef('mergemodal', () => {
        this.$refs.mergemodal.show()
      })
    }
  }
}
</script>
