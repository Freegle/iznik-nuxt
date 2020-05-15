<template>
  <div v-if="shortlink.type === 'Group'">
    <b-row class="m-0">
      <b-col cols="3">
        <a :href="shortlink.url" target="_blank">
          {{ shortlink.nameshort }}
        </a>
      </b-col>
      <b-col cols="7">
        <a :href="'https://freegle.in/' + shortlink.name">
          {{ 'https://freegle.in/' + shortlink.name }}
        </a>
      </b-col>
      <b-col cols="2">
        <b-btn variant="white" class="mb-1" :to="'/shortlinks/' + shortlink.id">
          View Stats
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  props: {
    shortlink: {
      type: Object,
      required: true
    }
  }
}
</script>
