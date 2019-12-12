<template>
  <div>
    <b-row>
      <b-col cols="3">
        {{ chat.date | dateonly }}
      </b-col>
      <b-col cols="4">
        {{ chat.name }}
      </b-col>
      <b-col cols="1">
        <b-btn variant="white" @click="showMessages = true">
          Show messages
        </b-btn>
      </b-col>
    </b-row>
    <div v-if="showMessages">
      <div v-for="message in chat.messages" :key="message.id">
        <b-row class="bg-white">
          <b-col cols="4">
            {{ message.date | dateonly }}
          </b-col>
          <b-col cols="8">
            {{ message.message }}
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showMessages: false
    }
  }
}
</script>
