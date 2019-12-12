<template>
  <div>
    <b-row>
      <b-col cols="2">
        #{{ post.id }}
      </b-col>
      <b-col cols="2">
        {{ post.arrival | dateonly }}
      </b-col>
      <b-col cols="3">
        {{ post.groups[0].namedisplay }}
      </b-col>
      <b-col cols="4">
        {{ post.subject }}
      </b-col>
      <b-col cols="1">
        <b-btn variant="white" @click="showJSON = true">
          Details
        </b-btn>
      </b-col>
    </b-row>
    <vue-json-pretty v-if="showJSON" :data="post" class="bg-white" />
  </div>
</template>
<script>
import VueJsonPretty from 'vue-json-pretty'

export default {
  components: {
    VueJsonPretty
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showJSON: false
    }
  }
}
</script>
