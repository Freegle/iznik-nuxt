<template>
  <div>
    <client-only>
      <b-modal
        id="messagemodal"
        v-model="showModal"
        size="lg"
        hide-header
        hide-footer
        body-class="p-0 p-md-2"
        @shown="shown"
      >
        <template slot="modal-title" />
        <template slot="default" slot-scope="{ cancel }">
          <div @click="cancel">
            <v-icon name="times-circle" scale="3" class="close clickme" />
          </div>
          <div v-if="showImages">
            <ImageCarousel message-id="id" :attachments="message.attachments" />
            <hr>
            <div class="d-flex justify-content-between p-2 mb-2 p-md-0 mb-md-0">
              <div class="pr-2 w-50">
                <b-btn variant="secondary" size="lg" block @click="cancel">
                  Close
                </b-btn>
              </div>
              <b-btn
                size="lg"
                variant="primary"
                block
                class="w-50 pl-2"
                @click="showImages = false"
              >
                View description
              </b-btn>
            </div>
          </div>
          <MessageExpanded
            v-else
            :id="id"
            :replyable="replyable"
            :hide-close="hideClose"
            :actions="actions"
            :show-map="modalShown"
            class="ml-md-2 mr-md-2 mt-md-2 ml-0 mr-0 mt-0"
            @close="cancel"
            @zoom="showImages = true"
          />
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import MessageExpanded from '@/components/MessageExpanded'
import ImageCarousel from '@/components/ImageCarousel'

export default {
  components: { ImageCarousel, MessageExpanded },
  mixins: [modal],
  props: {
    id: {
      type: Number,
      required: true
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
    }
  },
  data: function() {
    return {
      modalShown: false,
      showImages: false
    }
  },
  computed: {
    message() {
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
    }
  },
  methods: {
    show(showImages) {
      this.showModal = true
      this.modalShown = false
      this.showImages = showImages
    },
    shown() {
      // We need to kick the Message component to show the map once the modakl has been shown, else it doesn't
      // render correctly.
      setTimeout(() => {
        this.modalShown = true
      }, 100)
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.close {
  top: -15px;
  right: -15px;
  position: absolute;
  z-index: 10000;
  opacity: 1;
  background-color: white;
  border-radius: 50%;

  @include media-breakpoint-down(sm) {
    top: 3px;
    right: 3px;
  }
}
</style>
