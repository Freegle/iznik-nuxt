<template>
  <b-card no-body>
    <b-card-header>
      <b-row>
        <b-col cols="2">
          <v-icon name="hashtag" class="text-muted" scale="0.75" />
          {{ spammer.id}}
        </b-col>
        <b-col cols=""
      </b-row>
    </b-card-header>
  </b-card>
</template>
<script>
export default {
  props: {
    spammer: {
      type: Object,
      required: true
    }
  },
  computed: {
    collname() {
      switch (this.spammer.collection) {
        case 'Spammer': {
          return 'Confirmed Spammer'
        }
        case 'Whitelisted': {
          return 'Whitelisted'
        }
        case 'PendingAdd': {
          return 'Unconfirmed Spammer'
        }
        case 'PendingRemove': {
          return 'Disputed Spammer'
        }
        default:
          return this.spammer.collection
      }
    }
  }
}
</script>
