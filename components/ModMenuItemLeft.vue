<template>
  <div :class="getClass">
    <!-- eslint-disable-next-line -->
    <span v-if="indent" class="pl-3" /><nuxt-link :to="link" @mousedown.native="click">{{ name }}</nuxt-link>
    <b-badge v-if="count && getCount(count)" :variant="countVariant">
      {{ getCount(count) }}
    </b-badge>
    <b-badge v-if="othercount && getCount(othercount)" variant="info">
      {{ getCount(othercount) }}
    </b-badge>
  </div>
</template>
<script>
export default {
  props: {
    link: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    count: {
      type: String,
      required: false,
      default: null
    },
    othercount: {
      type: String,
      required: false,
      default: null
    },
    countVariant: {
      type: String,
      required: false,
      default: 'danger'
    },
    indent: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    work() {
      return this.$store.getters['auth/work']
    },
    getClass() {
      return 'pl-1 ' + (this.$route.path === this.link ? 'active' : '')
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
    },
    click(e) {
      if (this.link) {
        if (this.$route.fullPath === this.link) {
          // Click on current route.  Reload.
          e.stopPropagation()
          this.$router.go()
        } else {
          this.$router.push(this.link)
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.active {
  background-color: $color-blue--light;

  a {
    color: $color-white;
  }
}
</style>
