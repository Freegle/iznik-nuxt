<template>
  <div>
    <b-card no-body class="mb-1 border border-success">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button
          :v-b-toggle="'mypost-' + message.id"
          block
          href="#"
          variant="white"
          class="text-left text-truncate noborder"
          @click="toggle"
        >
          <b-btn class="float-right ml-1" variant="white">
            <v-icon v-if="!expanded" name="caret-down" />
            <v-icon v-else name="caret-up" />
            <template slot="button-content" />
          </b-btn>
          <span v-if="unseen > 0" class="float-right ml-1">
            <b-badge variant="danger">
              <v-icon name="comments" class="fa-fw" /> {{ unseen }} unread
            </b-badge>
          </span>
          <span v-if="message.promisecount > 0" class="float-right ml-1">
            <b-badge variant="success">
              <v-icon name="handshake" class="fa-fw" /> Promised
            </b-badge>
          </span>
          <span v-if="message.replycount > 0" class="float-right ml-1">
            <b-badge variant="info">
              <v-icon name="user" class="fa-fw" /> {{ message.replycount | pluralize(['reply', 'replies'], { includeNumber: true }) }}
            </b-badge>
          </span>
          <h3>{{ message.subject }}</h3>
        </b-button>
      </b-card-header>
      <b-collapse :id="'mypost-' + message.id" :visible="expanded" role="tabpanel">
        <b-card-body>
          <b-card-text>
            <span v-if="message.attachments.length > 0" class="float-right clickme" @click="showPhotos">
              <b-badge v-if="message.attachments.length > 1" class="photobadge" variant="primary">+{{ message.attachments.length - 1 }} <v-icon name="camera" /></b-badge>
              <b-img-lazy
                rounded
                thumbnail
                class="attachment p-0 square mb-1"
                alt="Item picture"
                title="Item picture"
                :src="message.attachments[0].paththumb"
              />
            </span>
            <p :v-if="expanded">
              <span v-for="group in message.groups" :key="'message-' + message.id + '-' + group.id" class="small text-muted">
                {{ group.arrival | timeago }} on {{ group.namedisplay }} <span class="text-faded small">#{{ message.id }}</span>
              </span>
            </p>
            <span class="prewrap">{{ message.textbody }}</span>
            <span v-for="chat in chats" :key="'chat-' + chat.id">
              {{ chat.id }}
            </span>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-modal
      v-if="expanded && message.attachments.length"
      :id="'photoModal-' + message.id"
      ref="photoModal"
      :title="message.subject"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <b-carousel
          :id="'message-carousel-' + message.id"
          v-model="slide"
          :interval="5000"
          controls
          indicators
          img-width="100%"
        >
          <b-carousel-slide v-for="(attachment, index) in message.attachments" :key="'mesagephohoto-' + index + '-' + attachment.id">
            <b-img
              slot="img"
              center
              class="d-block img-fluid w-100 messagePhoto"
              :src="attachment.path"
              :alt="'Message photo ' + slide"
            />
          </b-carousel-slide>
        </b-carousel>
      </template>
    </b-modal>
  </div>
</template>
<style scoped>
.square {
  object-fit: cover;
  width: 200px;
  height: 200px;
}

img.attachment {
  max-height: 150px !important;
  max-width: 150px !important;
}

.messagePhoto {
  max-height: 600px !important;
}

.photobadge {
  left: 150px;
  top: -54px;
  position: relative;
}

.noborder {
  border: none !important;
  border-color: white !important;
}
</style>
<script>
// TODO DESIGN How do we use text-truncate with ellipsis to make long subjects look nicer?
// TODO When we click to expand, the visible text may be off the top or bottom of the screen.  Need to make it visible.
export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      expandCount: 5,
      slide: 0
    }
  },
  computed: {
    expanded() {
      let count = 0
      for (const message of this.messages) {
        if (message.type === this.message.type) {
          count++
        }
      }

      return count <= this.expandCount
    },
    unseen() {
      // We want all the chats which reference this message.  We fetch them in myposts, here we only need to
      // get them from the store
      const chats = Object.values(this.$store.getters['chats/list']())
      let unseen = 0

      for (const chat of chats) {
        if (chat.refmsgids) {
          if (chat.refmsgids.indexOf(this.message.id) !== -1) {
            // This chat references this message
            unseen += chat.unseen
          }
        }
      }

      console.log('Returning', unseen)
      return unseen
    }
  },
  methods: {
    toggle() {
      this.$root.$emit('bv::toggle::collapse', 'mypost-' + this.message.id)
    },
    showPhotos() {
      this.$bvModal.show('photoModal-' + this.message.id)
    }
  }
}
</script>
