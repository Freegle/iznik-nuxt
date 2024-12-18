<template>
  <div>
    <b-modal
      id="modRulesModal"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        Please configure group rules
      </template>
      <template slot="default">
        <ModMissingRules expanded />
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="secondary" @click="cancel">
          Not now
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import ModMissingRules from './ModMissingRules.vue'

export default {
  components: { ModMissingRules },
  mixins: [modal],
  data: function() {
    return {}
  },
  computed: {
    group() {
      return this.myGroup(this.groupid)
    }
  }
}
</script>
