<template>
  <span class="border border-info rounded p-2">
    <b-badge variant="light">
      <v-icon name="gift" class="fa-fw" /> {{ offers }}
    </b-badge>
    <b-badge variant="light">
      <v-icon name="search" class="fa-fw" /> {{ wanteds }}
    </b-badge>
    <b-badge :variant="user.modmails > 0 ? 'danger' : 'light'">
      <v-icon name="exclamation-triangle" class="fa-fw" /> {{ user.modmails }}
    </b-badge>
    <b-btn variant="link">
      <!--      TODO Show modal-->
      View posts
    </b-btn>
    <b-btn variant="link">
      <!--      TODO Show modal-->
      View logs
    </b-btn>
  </span>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    offers() {
      return this.countType('Offer')
    },
    wanteds() {
      return this.countType('Wanteds')
    }
  },
  methods: {
    countType(type) {
      let count = 0

      this.user.messagehistory.forEach(entry => {
        if (entry.type === type) {
          count++
        }
      })

      return count
    }
  }
}
</script>
