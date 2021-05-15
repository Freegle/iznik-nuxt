<template>
  <div v-if="message" :id="'msg-' + id" class="position-relative ml-2 mr-2 ml-sm-0 mr-sm-0" itemscope itemtype="http://schema.org/Product">
    <div itemprop="offers" itemscope itemtype="http://schema.org/Offer" class="d-none">
      <meta itemprop="priceCurrency" content="GBP">
      <span itemprop="price">0</span> |
      <span itemprop="availability">Instock</span>
    </div>
    <MessageSummary :id="message.id" :expand-button-text="expandButtonText" :replyable="replyable" @expand="expand" />
    <MessageModal
      :id="message.id"
      ref="modal"
      :replyable="replyable"
      :hide-close="hideClose"
      :actions="actions"
    />
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import Vue from 'vue'
import { TooltipPlugin } from 'bootstrap-vue'
import waitForRef from '@/mixins/waitForRef'
import MessageSummary from '@/components/MessageSummary'

import MessageModal from '@/components/MessageModal'

Vue.use(TooltipPlugin)

export default {
  components: {
    MessageModal,
    MessageSummary
  },
  mixins: [waitForRef],
  props: {
    id: {
      type: Number,
      required: true
    },
    expandButtonText: {
      type: String,
      required: false,
      default: 'See details and reply'
    },
    startExpanded: {
      type: Boolean,
      required: false,
      default: false
    },
    hideClose: {
      type: Boolean,
      required: false,
      default: false
    },
    replyable: {
      type: Boolean,
      required: false,
      default: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: true
    },
    recordView: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      expanded: false,
      reply: null
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
    showMap() {
      return this.message.lat || this.message.lng
    },
    home() {
      let ret = null

      if (this.me && this.me.settings && this.me.settings.mylocation) {
        ret = {
          lat: this.me.settings.mylocation.lat,
          lng: this.me.settings.mylocation.lng
        }
      }

      return ret
    },
    stillAvailable() {
      return (
        this.message.type === 'Offer' &&
        this.reply &&
        this.reply.length <= 35 &&
        this.reply.toLowerCase().indexOf('still available') !== -1
      )
    },
    replyToUser() {
      const msg = this.$store.getters['messages/get'](this.id)

      if (msg && msg.fromuser) {
        return msg.fromuser.id
      }

      return null
    },
    position() {
      let ret = null

      if (this.message) {
        if (this.message.location) {
          // This is what we put in for message submitted on FD.
          ret = this.message.location
        } else if (this.message.lat || this.message.lng) {
          // This happens for TN messages
          ret = {
            lat: this.message.lat,
            lng: this.message.lng
          }
        }
      }

      return ret
    }
  },
  watch: {
    async replyToSend(newVal, oldVal) {
      // Because of the way persistent store is restored, we might only find out that we have a reply to send
      // post-mount.
      if (newVal && newVal.replyTo === this.id) {
        this.reply = newVal.replyMessage
        await this.expand()

        this.$nextTick(() => {
          this.sendReply()
        })
      }
    }
  },
  async mounted() {
    if (this.startExpanded) {
      this.expand()
    }

    const reply = this.replyToSend

    if (reply && reply.replyTo === this.id) {
      // Because of the way persistent store is restored, we might or might not know that we have a reply to send
      // in the mount, or we might only pick it up in the watch.
      this.reply = reply.replyMessage
      await this.expand()
      this.sendReply()
    }
  },
  methods: {
    async expand() {
      if (!this.message.successful) {
        await Promise.all([
          this.$store.dispatch('messages/fetch', {
            id: this.id
          }),
          this.view()
        ])

        this.expanded = true

        this.waitForRef('modal', () => {
          this.$refs.modal.show()
        })
      }
    },
    async view() {
      if (this.recordView) {
        const me = this.$store.getters['auth/user']

        if (me) {
          await this.$store.dispatch('messages/view', {
            id: this.id
          })
        }
      }
    },
    contract(e) {
      this.expanded = null
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.card-body {
  padding: 0px;
}

.header--size4 {
  color: $colour-info-fg !important;
  font-weight: bold;
}

.messagePhoto {
  max-height: 600px !important;
}

.highlight {
  color: $color-orange--dark;
  background-color: initial;
  padding: 0;
}

.promisedfade {
  opacity: 0.3;
}

.grey {
  color: $color-gray--base;
}

.messagecard {
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px $color-gray--light;

  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1fr);

  @include media-breakpoint-up(sm) {
    grid-template-columns: 200px 1fr;
    grid-column-gap: 1rem;
    grid-template-rows: max-content max-content max-content auto auto auto;
  }

  &.offer {
    background-color: $color-white;
  }

  &.wanted {
    background-color: $color-green--light;
  }

  .header-title {
    grid-column: 1 / 2;
    grid-row: 1 / 2;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
    }
  }

  .header-history {
    grid-column: 1 / 2;
    grid-row: 2 / 3;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
    }
  }

  .header-description {
    grid-column: 1 / 2;
    grid-row: 4 / 5;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
      grid-row: 3 / 4;
    }
  }

  .header-options {
    grid-column: 1 / 2;
    grid-row: 5 / 6;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
      grid-row: 4 / 5;
    }
  }

  .header-expand {
    grid-column: 1 / 2;
    grid-row: 5 / 6;
    align-self: end;
    justify-self: end;

    @include media-breakpoint-up(sm) {
      grid-column: 2 / 3;
      grid-row: 4 / 5;
    }
  }
}

.freegled {
  filter: contrast(50%);
}

/deep/ label {
  font-weight: bold;
}
</style>
