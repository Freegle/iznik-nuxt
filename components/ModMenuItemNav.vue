<template>
  <div class="d-inline">
    <span class="d-none d-sm-inline">
      <span v-if="icon">
        <v-icon :name="icon" scale="2" /><br>
      </span>
      {{ name }}
    </span>
    <v-icon v-if="icon" :name="icon" class="d-inline d-sm-none" scale="2" />
    <b-badge v-if="getCount(count)" :variant="countVariant">
      {{ getCount(count) }}
    </b-badge>
  </div>
</template>
<script>
export default {
  props: {
    link: {
      type: String,
      required: false,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: null
    },
    count: {
      type: String,
      required: false,
      default: null
    },
    countVariant: {
      type: String,
      required: false,
      default: 'danger'
    }
  },
  computed: {
    work() {
      return this.$store.getters['auth/work']
    }
  },
  methods: {
    getCount(type) {
      for (const key in this.work) {
        if (key === type) {
          return this.work[key]
        }
      }

      return 0
    }
  }
}
</script>
