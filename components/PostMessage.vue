<template>
  <div>
    <client-only>
      <div class="d-flex flex-wrap">
        <div class="photoholder bg-light d-flex flex-column align-items-center justify-items-center mr-1">
          <client-only>
            <v-icon name="camera" scale="8.75" class="text-faded" />
          </client-only>
          <b-btn
            variant="primary"
            size="lg"
            :class="{
              'ml-3': true,
              'mr-3': true,
              'invisible': uploading && hidingPhotoButton
            }"
            @click="photoAdd"
            @drop.prevent="drop"
            @dragover.prevent
          >
            <span v-if="attachments && attachments.length === 1">
              Add more photos
            </span>
            <span v-else>
              Add photos
            </span>
          </b-btn>
        </div>
        <div v-for="att in attachments" :key="'image-' + att.id" class="bg-transparent p-0">
          <PostPhoto v-bind="att" class="mr-1" @remove="removePhoto" />
        </div>
        <hr>
      </div>
      <div v-if="uploading" class="bg-white">
        <client-only>
          <OurFilePond
            ref="filepond"
            imgtype="Message"
            imgflag="message"
            :identify="true"
            :browse="pondBrowse"
            :multiple="true"
            @photoProcessed="photoProcessed"
            @allProcessed="allProcessed"
            @init="hidePhotoButton"
          />
        </client-only>
      </div>
      <div class="subject-layout mb-1 mt-1">
        <div class="d-flex flex-column">
          <label :for="$id('posttype')" class="pl-1">
            Type
          </label>
          <b-input :id="$id('posttype')" v-model="type" disabled class="type text-uppercase bg-white mt-1" size="lg" />
        </div>
        <PostItem ref="item" v-model="item" class="item pt-1" @input="itemType" />
        <client-only>
          <NumberIncrementDecrement v-if="type === 'Offer'" :count.sync="availablenow" label="Quantity" append-text=" available" class="count pt-1" />
        </client-only>
      </div>
      <NoticeMessage v-if="duplicate" variant="warning">
        <p>You already have an open post <span class="font-weight-bold">{{ duplicate.subject }}</span>.</p>
        <p>
          If it's the same, please go to <nuxt-link to="/myposts">
            My Posts
          </nuxt-link> and use
          the <em>Repost</em> button.
        </p>
        <p>
          If it's different, please change the name slightly - then it'll be clearer for everyone
          that it's not the same.
        </p>
      </NoticeMessage>
      <div>
        <NoticeMessage v-if="vague" variant="warning" class="mt-1 mb-1">
          <p>
            Please avoid very general terms.  Be precise - you'll get a better response.
          </p>
        </NoticeMessage>
        <NoticeMessage v-if="warn" variant="warning" class="mt-1">
          <h1 class="header--size3">
            <client-only>
              <v-icon name="info-circle" scale="1.75" />
            </client-only>
            {{ warn.type }}
          </h1>
          <p>
            {{ warn.message }}
          </p>
        </NoticeMessage>
      </div>
      <div class="d-flex flex-column mt-2">
        <label :for="$id('description')">Please give a few details:</label>
        <b-form-textarea
          :id="$id('description')"
          v-model="description"
          :placeholder="placeholder"
          rows="8"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
import NoticeMessage from './NoticeMessage'
import NumberIncrementDecrement from './NumberIncrementDecrement'
const OurFilePond = () => import('~/components/OurFilePond')
const PostPhoto = () => import('~/components/PostPhoto')
const PostItem = () => import('~/components/PostItem')

export default {
  components: {
    NumberIncrementDecrement,
    NoticeMessage,
    OurFilePond,
    PostPhoto,
    PostItem
  },

  props: {
    id: {
      type: Number,
      required: false,
      default: -1
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      uploading: false,
      myFiles: [],
      pondBrowse: true,
      hidingPhotoButton: false,
      vagueness: [
        '^eney fink$',
        '^eney think$',
        '^furniture$',
        '^household$',
        '^anything$',
        '^stuff$',
        '^things$',
        '^tools$',
        '^garden$',
        '^goods$',
        "^don't know$",
        '^items$',
        '^browsing$',
        '^browse$',
        '^any$'
      ],
      warnings: [
        {
          type: 'Upholstered household items and furniture',
          message:
            'There is no requirement for freegled items to have fire labels, but please be honest in your description or make sure you don’t ask for things that aren’t suitable for your use.',
          keywords: [
            'sofa',
            'sofabed',
            'couch',
            'settee',
            'armchair',
            'headboard',
            'stool',
            'futon',
            'mattress',
            'mattress',
            'pillow',
            'cushion',
            'seat pad'
          ]
        },
        {
          type: 'Cot Mattress',
          message:
            'To be safe mattresses should be clean, dry and free from fabric tears, fit the cot snugly, with no gaps, firm and with no sagging.',
          keywords: ['cot mattress']
        },
        {
          type: 'Motorcycle and cycle helmets',
          message:
            'Using helmets that have been involved in a crash is not recommended.',
          keywords: ['helmet']
        },
        {
          type: 'Car seats',
          message:
            'These should be undamaged and suitable for the child’s weight and height, and fit securely in the vehicle.',
          keywords: ['car seat', 'carseat', 'child car']
        }
      ]
    }
  },
  computed: {
    availablenow: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage'](this.id)
        return msg &&
          'availablenow' in msg &&
          typeof msg.availablenow !== 'undefined'
          ? msg.availablenow
          : 1
      },
      set: function(newValue) {
        this.saveItem(this.item, newValue)
      }
    },
    item: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage'](this.id)
        return msg && msg.item ? msg.item : ''
      },
      set: function(newValue) {
        this.saveItem(newValue, this.availablenow)
      }
    },
    vague() {
      let ret = false
      let item = this.item

      if (item) {
        item = item.toLowerCase()

        this.vagueness.forEach(v => {
          if (item.match(v)) {
            ret = true
          }
        })
      }

      return ret
    },
    warn() {
      let ret = null
      let item = this.item

      if (item) {
        item = item.toLowerCase()

        this.warnings.forEach(k => {
          k.keywords.forEach(v => {
            if (item.indexOf(v) !== -1) {
              ret = k
            }
          })
        })
      }

      return ret
    },
    description: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage'](this.id)
        return msg ? msg.description : null
      },
      set: function(newValue) {
        this.$store.dispatch('compose/setDescription', {
          id: this.id,
          type: this.type,
          description: newValue
        })
      }
    },
    attachments() {
      const ret = this.$store.getters['compose/getAttachments'](this.id)
      return ret || []
    },
    placeholder() {
      return this.type === 'Offer'
        ? "e.g. colour, condition, size, whether it's working etc."
        : "Explain what you're looking for, and why you'd like it."
    },
    duplicate() {
      let ret = null

      const messages = this.$store.getters['messages/getAll']

      messages.forEach(m => {
        if (
          m.fromuser &&
          m.fromuser.id === this.myid &&
          m.type === this.type &&
          m.item &&
          this.item &&
          m.item.name.toLowerCase() === this.item.toLowerCase() &&
          m.id !== this.id &&
          (!m.outcomes || !m.outcomes.length)
        ) {
          // Exactly duplicate of open post.
          ret = m
        }
      })

      return ret
    }
  },
  methods: {
    saveItem(item, availablenow) {
      this.$store.dispatch('compose/setItem', {
        id: this.id,
        item: item,
        type: this.type,
        availablenow: availablenow
      })
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      console.log("PostMessage.vue photoAdd")
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb, image, ocr, suggestions) {
      // We have uploaded a photo.  Remove the filepond instance.
      const att = {
        id: imageid,
        paththumb: imagethumb,
        path: image
      }

      this.$store.dispatch('compose/addAttachment', {
        id: this.id,
        attachment: att
      })
    },
    allProcessed() {
      this.uploading = false
    },
    removePhoto(id) {
      this.$store.dispatch('compose/removeAttachment', {
        id: this.id,
        photoid: id
      })
    },
    itemType(value) {
      if (value) {
        this.$store.dispatch('compose/setItem', {
          id: this.id,
          item: this.item,
          type: this.type,
          availablenow: this.availablenow
        })
      } else {
        this.uploading = false
      }
    },
    chooseSuggestion(suggestion) {
      this.item = suggestion.name
      this.$refs.item.set(this.item)
      this.$store.dispatch('compose/setItem', {
        id: this.id,
        item: this.item,
        type: this.type,
        availablenow: this.availablenow
      })
    },
    drop(e) {
      // Although it's probably not widely used (I didn't know it even worked) in the old code you could drag and drog
      // a file onto the Add photos button.  So we should handle that too here.
      const droppedFiles = e.dataTransfer.files

      if (!droppedFiles) {
        return
      }

      this.uploading = droppedFiles.length
      this.pondBrowse = false

      // Give pond time to render.
      this.waitForRef('filepond', () => {
        ;[...droppedFiles].forEach(f => {
          this.$refs.filepond.addFile(f)
        })
      })
    },
    hidePhotoButton() {
      this.hidingPhotoButton = true
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.subject-layout {
  display: grid;
  grid-template-columns: 1fr 50px 1fr;
  grid-template-rows: auto auto;
  grid-column-gap: 5px;

  @include media-breakpoint-up(md) {
    grid-template-columns: 1fr 3fr auto;
    grid-template-rows: auto;
  }

  .type {
    grid-column: 1 / 2;
    grid-row: 1 / 2;

    @include media-breakpoint-up(md) {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
  }

  .item {
    grid-column: 1 / 4;
    grid-row: 2 / 3;

    @include media-breakpoint-up(md) {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
  }

  .count {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    justify-self: end;

    @include media-breakpoint-up(md) {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
    }
  }
}

.photoholder {
  width: 200px;
  height: 200px;
}
</style>
