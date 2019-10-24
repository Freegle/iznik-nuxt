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
                <div class="float-left">
                  <Postcode :focus="false" :find="false" size="md" class="d-inline" @selected="postcodeSelect" />
                  <ComposeGroup class="d-inline align-top" :width="200" />
                </div>
                <div class="ml-auto float-right">
                  <b-btn v-if="ids.length > 1" variant="white" class="" @click="deleteItem">
                    <v-icon name="trash-alt" />&nbsp;Delete item
                  </b-btn>
                  <b-btn variant="white" class="" @click="addItem">
                    <v-icon name="plus" />&nbsp;Add another item
                  </b-btn>
                </div>
              </b-card-footer>
            </b-card>
          </li>
        </ul>
        <b-row>
          <b-col class="text-muted small pl-0 pt-1 text-center">
            We may show this post, but not your email address, to people who are not yet members of Freegle.
            This helps the community grow by showing people what's happening and encouraging them to join.
          </b-col>
        </b-row>
        <transition name="fade">
          <b-row v-if="valid">
            <b-col cols="12" md="6" offset-md="3" class="text-center pt-2">
              <b-btn variant="success" size="lg" block @click="next">
                Next <v-icon name="angle-double-right" />
              </b-btn>
            </b-col>
          </b-row>
        </transition>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>
<script>
// TODO Add speech recognition
// TODO Image recognition
// TODO Suppose we end up here, without a postcode in the store?

import loginOptional from '@/mixins/loginOptional.js'
const PostMessage = () => import('~/components/PostMessage')
const Postcode = () => import('~/components/Postcode')
const ComposeGroup = () => import('~/components/ComposeGroup')

export default {
  components: {
    PostMessage,
    Postcode,
    ComposeGroup
  },
  mixins: [loginOptional],
  data: function() {
    return {}
  },
  computed: {
    postcode() {
      return this.$store.getters['compose/getPostcode']()
    },
    ids() {
      const messages = Object.values(
        this.$store.getters['compose/getMessages']()
      )

      let ids = []
      for (const message of messages) {
        if (message.id && message.type === 'Offer') {
          ids.push(message.id)
        }
      }

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
      this.$store.dispatch('compose/clearMessage', {
        id: this.ids[this.ids.length - 1]
      })
    },
    addItem() {
      // Find a new id.
      let nextId = -1
      for (const id of this.ids) {
        nextId = Math.min(id, nextId)
      }

      this.$store.dispatch('compose/setMessage', {
        id: --nextId,
        item: null,
        description: null,
        type: 'Offer'
      })
    },
    next() {
      this.$router.push('/give/whoami')
    },
    postcodeSelect(pc) {
      this.$store.dispatch('compose/setPostcode', this.postcode)

      // If we don't have a group currently which is in the list near this postcode, choose the closest.  That
      // allows people to select further away groups if they wish.
      const groupid = this.$store.getters['compose/getGroup']()

      if (pc && pc.groupsnear) {
        let found = false
        for (const group of pc.groupsnear) {
          if (parseInt(group.id) === parseInt(groupid)) {
            found = true
          }
        }

        if (!found) {
          this.group = pc.groupsnear[0].id
        } else {
          this.group = groupid
        }

        this.$store.dispatch('compose/setGroup', this.group)
      }
    }
  }
}
</script>
