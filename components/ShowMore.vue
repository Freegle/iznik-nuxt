<template>
  <div>
    <div v-for="item in itemsToShow" :key="item[keyfield]">
      <slot name="item" :item="item">
        Item {{ item[keyfield] }}
      </slot>
    </div>
    <b-btn v-if="items.length > limit && !expanded" variant="link" @click="expanded = true">
      Show more...
    </b-btn>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    limit: {
      type: Number,
      required: false,
      default: 10
    },
    keyfield: {
      type: String,
      required: false,
      default: 'id'
    }
  },
  data: function() {
    return {
      expanded: false
    }
  },
  computed: {
    itemsToShow() {
      if (this.expanded || this.items.length < this.limit) {
        return this.items
      } else {
        return this.items.slice(0, this.limit)
      }
    }
  }
}
</script>
