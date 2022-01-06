<template>
  <div>
    <ModMicrovolunteeringModal ref="modal" :user="user" :item-ids="itemIds" />
    <b-btn variant="link" @click="showModal">
      View
    </b-btn>
  </div>
</template>
<script>
import ModMicrovolunteeringModal from '@/components/ModMicrovolunteeringModal'

export default {
  components: {
    ModMicrovolunteeringModal
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    itemIds() {
      return this.items.map(m => m.id)
    }
  },
  methods: {
    showModal() {
      this.$refs.modal.show()
    }
  }
}
</script>
