<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6" class="p-0">
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
        <ul v-for="(id, index) in ids" :key="'post-' + id" class="p-0 pt-1 list-unstyled">
          <li class="p-0">
            <b-card no-body>
              <b-card-body class="pt-0 pb-1">
                <PostMessage :id="id" type="Offer" />
              </b-card-body>
              <b-card-footer v-if="index === ids.length - 1">
                <b-btn variant="white" class="mt-2 float-left" @click="deleteItem">
                  <fa icon="trash-alt" />&nbsp;Delete item
                </b-btn>
                <b-btn variant="white" class="mt-2 float-right" @click="addItem">
                  <fa icon="plus" />&nbsp;Add another item
                </b-btn>
              </b-card-footer>
            </b-card>
          </li>
        </ul>
        <b-row>
          <b-col class="text-muted small pl-0 pt-1">
            We may show this post, but not your email address, to people who are not yet members of Freegle.
            This helps the community grow by showing people what's happening and encouraging them to join.
          </b-col>
        </b-row>
        <b-row v-if="valid">
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
<script>
// TODO Add speech recognition
// TODO Image recognition
// TODO Suppose we end up here, without a postcode in the store?
// TODO Add speech recognition

import PostMessage from '~/components/PostMessage'

export default {
  components: {
    PostMessage
  },
  data: function() {
    return {}
  },
  computed: {
    ids() {
      const messages = Object.values(
        this.$store.getters['compose/getMessages']()
      )

      let ids = []
      for (const message of messages) {
        if (message.id) {
          ids.push(message.id)
        }
      }

      console.log('IDS', ids)

      if (ids.length === 0) {
        ids = [-1]
      }

      return ids
    },

    valid() {
      const messages = Object.values(
        this.$store.getters['compose/getMessages']()
      )
      let valid = true

      if (messages) {
        for (const message of messages) {
          if (this.ids.indexOf(message.id) !== -1 || !message.id) {
            const atts = Object.values(
              this.$store.getters['compose/getAttachments'](message.id)
            )

            // A message is valid if there is an item, and either a description or a photo.
            if (!message.item || (!message.description && !atts.length)) {
              valid = false
            }
          }
        }
      }

      return valid
    }
  },
  methods: {
    deleteItem() {
      this.ids.pop()
    },

    addItem() {
      // Find a new id.
      let nextId = -1
      for (const id of this.ids) {
        nextId = Math.min(id, nextId)
      }

      console.log('Next id', nextId)
      this.$store.dispatch('compose/setMessage', {
        id: --nextId,
        item: null,
        description: null
      })
    },

    next() {
      this.$router.push('/give/whoami')
    }
  }
}
</script>
