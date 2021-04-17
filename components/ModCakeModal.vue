<template>
  <div>
    <b-modal
      id="modcakemodal"
      v-model="showModal"
      title="Would you like some cake?"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <ModCake />
        <p class="mt-2 text-muted">
          <!-- eslint-disable-next-line -->
          You can change your mind later from <nuxt-link to="/modtools/settings">Settings->Personal</nuxt-link>.
        </p>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="primary" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import ModCake from '~/components/ModCake'

export default {
  components: {
    ModCake
  },
  mixins: [modal],
  mounted() {
    if (!this.$store.getters['misc/get']('cakeasked')) {
      this.show()

      this.$store.dispatch('misc/set', {
        key: 'cakeasked',
        value: true
      })
    }
  }
}
</script>
