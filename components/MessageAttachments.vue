<template>
  <div>
    <div v-if="defaultAttachments || !attachments.length">
      <MessageTag :id="id" def :message-override="messageOverride" class="pl-2 pr-2" />
      <div class="d-flex justify-content-around bg rounded">
        <v-icon name="camera" scale="4" class="text-faded align-self-center justify-se" />
      </div>
    </div>
    <button v-else class="w-100 p-0 border-0" :disabled="disabled">
      <MessageTag :id="id" :message-override="messageOverride" class="pl-2 pr-2" />
      <div v-if="!thumbnail && attachments && attachments.length" class="photozoom" @click="$emit('zoom')">
        View larger image
      </div>
      <div class="photobadge d-flex">
        <b-badge v-if="attachments.length > 1" @click="$emit('zoom')">
          1 / {{ attachments.length }} <v-icon name="camera" />
        </b-badge>
      </div>
      <div :class="{ thumbnail: thumbnail, notThumbnail: !thumbnail }">
        <b-img-lazy
          rounded
          class="d-none d-md-block attachment p-0"
          generator-unable-to-provide-required-alt=""
          title="Item picture"
          :src="thumbnail ? attachments[0].paththumb : attachments[0].path"
          itemprop="image"
          @error.native="brokenImage"
          @click.native="$emit('zoom')"
        />
        <b-img-lazy
          rounded
          class="d-block d-md-none attachment p-0"
          generator-unable-to-provide-required-alt=""
          title="Item picture"
          :src="attachments[0].path"
          itemprop="image"
          @error.native="brokenImage"
          @click.native="$emit('zoom')"
        />
      </div>
    </button>
  </div>
</template>
<script>
import waitForRef from '@/mixins/waitForRef'
import MessageTag from '@/components/MessageTag'

export default {
  components: { MessageTag },
  mixins: [waitForRef],
  props: {
    id: {
      type: Number,
      required: true
    },
    messageOverride: {
      type: Object,
      required: false,
      default: null
    },
    attachments: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    thumbnail: {
      type: Boolean,
      required: false,
      default: false
    },
    showZoom: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      defaultAttachments: false
    }
  },
  computed: {
    message() {
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
    },
    group() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        const groupid = this.message.groups[0].groupid
        ret = this.mygroups.find(g => parseInt(g.id) === groupid)
      }

      return ret
    }
  },
  methods: {
    brokenImage() {
      // If the attachment image is broken, we're best off just hiding it.
      this.defaultAttachments = true
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.attachment {
  object-fit: cover;
  width: 100%;
  box-shadow: 0 0 1 $color-gray--dark;
}

.thumbnail {
  .attachment {
    height: 200px;
  }
}

.notThumbnail {
  .attachment {
    height: 200px;

    @include media-breakpoint-up(sm) {
      height: 360px;
    }
  }
}

.photobadge {
  right: 10px;
  position: absolute;
  bottom: 10px;
  background-color: $color-gray--darker;
  color: white;
  border-radius: 4px;
}

.photozoom {
  left: 10px;
  position: absolute;
  bottom: 10px;
  background-color: $color-gray--darker;
  color: white;
  border-radius: 4px;
  padding-left: 10px;
  padding-right: 10px;
}

.bg {
  background-color: $color-gray--light;
  width: 100%;
  height: 200px;
}
</style>
