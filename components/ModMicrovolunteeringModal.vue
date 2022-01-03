<template>
  <div>
    <client-only>
      <b-modal
        id="aboutmemodal"
        v-model="showModal"
        :title="'Microvolunteering for ' + user.displayname"
        size="xl"
      >
        <template slot="default">
          <div v-for="item in itemIds" :key="'item-' + item" class="p-0 mt-2">
            <ModMicrovolunteering :id="item" />
          </div>
        </template>
        <template slot="modal-footer" slot-scope="{ cancel }">
          <b-button variant="white" @click="cancel">
            Cancel
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import ModMicrovolunteering from '~/components/ModMicrovolunteering'

export default {
  components: {
    ModMicrovolunteering
  },
  mixins: [modal],
  props: {
    user: {
      type: Object,
      required: true
    },
    itemIds: {
      type: Array,
      required: true
    }
  }
}
</script>
