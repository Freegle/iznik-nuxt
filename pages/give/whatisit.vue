<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <b-row class="bs-wizard">
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              Where are you?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum active">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot active" />
            <div class="bs-wizard-info text-center">
              What is it?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              Who are you?
            </div>
          </b-col>
        </b-row>

        <h1 class="text-center">
          Ok, now tell us about your item
        </h1>
        <b-row>
          <b-col cols="auto" class="mt-2 pl-0">
            <b-btn variant="success" size="lg">
              <fa icon="camera" />&nbsp;Add photos
            </b-btn>
          </b-col>
          <b-col class="text-center mt-2">
            <b-alert variant="info" class="d-none d-md-inline-block float-right" show>
              <fa icon="info-circle" />&nbsp;Please add photos - you'll get a better response.
            </b-alert>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="pl-0">
            <b-form-input
              v-model="item"
              size="60"
              maxlength="60"
              spellcheck="true"
              placeholder="In a single word or phrase, what is it?"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="pl-0 pt-1">
            <b-form-textarea
              v-model="description"
              placeholder="Please give a few details if possible, e.g. colour, condition, size etc."
              rows="6"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-muted small pl-0 pt-1">
            We may show this post, but not your email address, to people who are not yet members of Freegle.
            This helps the community grow by showing people what's happening and encouraging them to join.
          </b-col>
        </b-row>
        <b-row v-if="item && (description || attachments.length)">
          <b-col cols="12" md="6" offset-md="3" class="text-center pt-2">
            <b-btn variant="success" size="lg" block @click="next">
              Next >>
            </b-btn>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
// TODO Add speech recognition
// TODO Image recognition
// TODO Suppose we end up here, without a postcode in the store?
export default {
  components: {},
  data() {
    return {
      id: null,
      valid: false
    }
  },
  computed: {
    item: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage']()
        return msg ? msg.item : null
      },
      set: function(newValue) {
        this.$store.dispatch('compose/setItem', newValue)
        this.valid = this.item && this.description
      }
    },
    description: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage']()
        return msg ? msg.description : null
      },
      set: function(newValue) {
        this.$store.dispatch('compose/setDescription', newValue)
        this.valid = this.item && this.description
      }
    },
    attachments() {
      return this.$store.getters['compose/getAttachments']()
    }
  },
  methods: {
    save() {
      this.$store.dispatch('compose/setMessage', {
        item: this.item,
        description: this.description,
        type: 'Offer'
      })
    },
    async next() {
      await this.save()
      this.$router.push('/give/whoami')
    }
  }
}
</script>
