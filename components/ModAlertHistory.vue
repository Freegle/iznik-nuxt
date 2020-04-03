<template>
  <!--  <div>-->
  <!--    Alert {{ JSON.stringify(alert) }}-->
  <!--  </div>-->
  <b-row>
    <b-col cols="6" lg="2">
      {{ alert.created | datetimeshort }}
    </b-col>
    <b-col cols="6" lg="2">
      {{ alert.complete | datetimeshort }}
    </b-col>
    <b-col cols="6" lg="2">
      <div v-if="alert.group">
        {{ alert.group.nameshort }}
      </div>
    </b-col>
    <b-col cols="6" lg="4">
      {{ alert.subject }}
    </b-col>
    <b-col cols="6" lg="2">
      <b-btn variant="white" class="mr-1">
        Show Stats
      </b-btn>
      <b-btn variant="white">
        Show Body
      </b-btn>
    </b-col>
  </b-row>
</template>
<script>
export default {
  props: {
    alert: {
      type: Object,
      required: true
    }
  }
}
</script>
