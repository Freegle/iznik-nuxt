<template>
  <div class="d-inline clickme" @click="click">
    <span v-if="name" class="d-inline d-sm-none largeish">
      {{ name }}
    </span>
    <v-icon v-if="icon" :name="icon" class="d-inline d-sm-none fw" scale="2" />
    <b-badge :variant="countVariant" :class="(countOnTop ? 'leftandtop' : 'largeish') + (showValue ? '' : ' hideme')">
      {{ showValue }}
    </b-badge>
    <b-badge v-show="getCount(othercount)" variant="info" :class="countOnTop ? 'leftanddown' : 'largeish'">
      {{ getCount(othercount) }}
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
      required: false,
      default: null
    },
    icon: {
      type: String,
      required: false,
      default: null
    },
    value: {
      type: Number,
      required: false,
      default: null
    },
    count: {
      type: Array,
      required: false,
      default: null
    },
    othercount: {
      type: Array,
      required: false,
      default: null
    },
    countVariant: {
      type: String,
      required: false,
      default: 'danger'
    },
    countOnTop: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    work() {
      return this.$store.getters['auth/work']
    },
    showValue() {
      if (this.value !== null) {
        return this.value
      } else {
        return this.getCount(this.count)
      }
    }
  },
  methods: {
    getCount(types) {
      let total = 0

      if (types) {
        for (const key in this.work) {
          if (types.indexOf(key) !== -1) {
            total += this.work[key]
          }
        }
      }

      return total
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
<style scoped>
.leftanddown {
  position: relative;
  left: -10px;
  top: 12px;
}

.leftandtop {
  position: relative;
  left: -10px;
  top: -12px;
}

.fw {
  width: 2rem;
  height: 2rem;
}

.largeish {
  font-size: 2em !important;
}

/*This class is used to make the badge invisible. I've tried various other ways of doing this and I'm bored now.*/
.hideme {
  color: transparent;
  background-color: transparent;
}
</style>
