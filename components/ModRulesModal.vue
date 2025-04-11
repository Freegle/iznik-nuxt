<template>
  <div>
    <b-modal
      id="modRulesModal"
      v-model="showModal"
      size="lg"
      no-stacking
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <template slot="modal-title" class="w-100">
        Please configure group rules
      </template>
      <template slot="default">
        <ModMissingRules expanded />
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="secondary" :disabled="enableIn > 0" @click="cancel">
          Not now
          <span v-if="enableIn > 0">({{ enableIn }})</span>
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
    return {
      enableIn: 0,
      timer: null
    }
  },
  computed: {
    group() {
      return this.myGroup(this.groupid)
    },
    delay() {
      const now = new Date()
      const start = new Date(now.getFullYear(), 3, 6)
      const diff = now - start
      const oneDay = 1000 * 60 * 60 * 24
      return Math.floor(diff / oneDay)
    }
  },
  mounted() {
    this.enableIn = this.delay
    this.timer = setTimeout(this.tick, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  methods: {
    tick() {
      this.timer = null

      if (this.enableIn > 0) {
        this.enableIn -= 1

        this.timer = setTimeout(this.tick, 1000)
      }
    }
  }
}
</script>
