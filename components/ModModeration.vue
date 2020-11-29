<template>
  <div class="d-inline d-flex justify-content-start flex-wrap">
    <b-select v-model="postingStatus" :options="options" class="sel" :size="size" />
    <b-select v-model="trustlevel" class="sel" :size="size" readyonly>
      <option :value="null">
        Volunteering - not asked
      </option>
      <option value="Basic">
        Volunteering - basic
      </option>
      <option value="Moderate">
        Volunteering - moderate
      </option>
      <option value="Advanced">
        Volunteering - advanced
      </option>
      <option value="Declined">
        Volunteering - declined
      </option>
      <option value="Excluded">
        Volunteering - disabled
      </option>
    </b-select>
  </div>
</template>
<script>
export default {
  props: {
    membership: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    }
  },
  computed: {
    postingStatus: {
      get() {
        return this.membership.ourpostingstatus || 'MODERATED'
      },
      async set(val) {
        await this.$store.dispatch('user/edit', {
          id: this.user.id,
          groupid: this.membership.id,
          ourPostingStatus: val
        })
      }
    },
    trustlevel: {
      get() {
        return this.user.trustlevel
      },
      async set(val) {
        await this.$store.dispatch('user/edit', {
          id: this.user.id,
          groupid: this.membership.id,
          trustlevel: val
        })
      }
    },
    options() {
      return [
        {
          value: 'MODERATED',
          text: 'Moderated'
        },
        {
          value: 'DEFAULT',
          text: 'Group Settings'
        },
        {
          value: 'PROHIBITED',
          text: "Can't Post"
        }
      ]
    }
  }
}
</script>
<style scoped>
.sel {
  max-width: 200px;
}
</style>
