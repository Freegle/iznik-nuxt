<template>
  <div :id="'msg-' + id" class="position-relative">
    <template v-if="message.successful">
      <MessageFreegled :id="id" />
    </template>
    <div :class="classes" @click="expand">
      <div>
        <MessageItemLocation
          :id="id"
          :matchedon="message.matchedon"
          class="mb-1 header-title"
          :type="message.type"
          :expanded="false"
          :message-override="messageOverride"
        />
      </div>
      <MessageHistory :message="message" class="mb-1 header-history" :display-message-link="sm()" />
      <div class="mb-1 header-description">
        <div v-if="!message.attachments || !message.attachments.length" class="d-flex d-md-none" @click="zoom">
          <MessageTag :id="id" :message-override="messageOverride" class="pl-2 pr-2" inline />
          <div class="flex-grow-1" />
        </div>
        <MessageDescription :id="id" :matchedon="message.matchedon" />
      </div>
      <div v-if="!message.successful && replyable" class="header-expand mt-2 mt-sm-0">
        <b-button variant="primary" class="mt-2" @click="expand">
          {{ expandButtonText }}
        </b-button>
      </div>
      <div class="image-wrapper" @click="zoom">
        <MessageAttachments
          :id="id"
          :attachments="message.attachments"
          :disabled="message.successful"
          thumbnail
        />
      </div>
    </div>
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import Vue from 'vue'
import { TooltipPlugin } from 'bootstrap-vue'
import breakpoints from '@/mixins/breakpoints'
import MessageTag from '@/components/MessageTag'
import MessageItemLocation from '~/components/MessageItemLocation'
import MessageFreegled from '~/components/MessageFreegled'
import MessageAttachments from '~/components/MessageAttachments'

const MessageHistory = () => import('~/components/MessageHistory')
const MessageDescription = () => import('~/components/MessageDescription')

Vue.use(TooltipPlugin)

export default {
  components: {
    MessageDescription,
    MessageItemLocation,
    MessageFreegled,
    MessageAttachments,
    MessageHistory,
    MessageTag
  },
  mixins: [breakpoints],
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
    replyable: {
      type: Boolean,
      required: false,
      default: true
    },
    messageOverride: {
      type: Object,
      required: false,
      default: null
    },
    bgClass: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {}
  },
  computed: {
    message() {
      return this.messageOverride
        ? this.messageOverride
        : this.$store.getters['messages/get'](this.id)
    },
    classes() {
      const ret = {
        messagecard: true,
        freegled: this.message.successful,
        offer: this.message.type === 'Offer',
        wanted: this.message.type === 'Wanted',
        clickme: !this.message.successful,
        promisedfade: this.message.promised && this.replyable,
        'p-2': true,
        'p-sm-3': true
      }

      if (this.bgClass) {
        ret[this.bgClass] = true
      }

      return ret
    }
  },
  methods: {
    expand() {
      this.$emit('expand')
    },
    zoom(e) {
      if (this.message) {
        if (!this.message.attachments || !this.message.attachments.length) {
          // No photos - show the description.
          this.$emit('expand')
        } else {
          this.$emit('zoom')
        }

        e.preventDefault()
        e.stopPropagation()
      }
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

.promisedfade {
  opacity: 0.3;
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

  .image-wrapper {
    position: relative;

    grid-column: 1 / 2;
    grid-row: 3 / 4;

    @include media-breakpoint-up(sm) {
      grid-column: 1 / 2;
      grid-row: 1 / 5;
      width: unset;
    }

    &.noattachments {
      display: none;

      @include media-breakpoint-up(md) {
        display: block;
      }
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
