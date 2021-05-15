<template>
  <div :id="'msg-' + id" class="position-relative ml-2 mr-2 ml-sm-0 mr-sm-0">
    <span ref="breakpoint" class="d-inline d-sm-none" />
    <template v-if="message.successful">
      <MessageFreegled :id="id" />
    </template>
    <div
      :class="{
        messagecard: true,
        freegled : message.successful,
        offer: message.type === 'Offer',
        wanted: message.type === 'Wanted',
        clickme: true,
        promisedfade: message.promised && replyable
      }"
      @click="expand"
    >
      <MessageItemLocation :id="id" :matchedon="message.matchedon" class="mb-1 header-title" :type="message.type" :expanded="false" />
      <MessageHistory :message="message" class="mb-1 header-history" :display-message-link="sm()" />
      <client-only>
        <MessageDescription :id="id" :matchedon="message.matchedon" class="mb-1 header-description" />
      </client-only>
      <div v-if="!message.successful" class="header-expand mt-2 mt-sm-0">
        <b-button variant="primary" class="mt-2" @click="expand">
          {{ expandButtonText }} <v-icon name="angle-double-right" />
        </b-button>
      </div>
      <MessageAttachments
        :id="id"
        :attachments="message.attachments"
        class="image-wrapper"
        :disabled="message.successful"
        @click="expand"
      />
    </div>
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import Vue from 'vue'
import { TooltipPlugin } from 'bootstrap-vue'
import waitForRef from '@/mixins/waitForRef'
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
    MessageHistory
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
    replyable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {}
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  },
  methods: {
    sm() {
      // Detect breakpoint by checking computing style of an element which uses the bootstrap classes
      let ret = false

      if (process.client) {
        const el = this.$refs.breakpoint
        if (el) {
          const display = getComputedStyle(el, null).display

          if (display === 'none') {
            ret = true
          }
        }
      }

      return ret
    },
    expand() {
      this.$emit('expand')
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
    grid-row: 3 / 5;

    @include media-breakpoint-up(sm) {
      grid-column: 1 / 2;
      grid-row: 1 / 5;
      width: unset;
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
