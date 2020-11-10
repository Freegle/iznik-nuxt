<template>
  <div>
    <div class="d-flex flex-wrap">
      <div class="photoholder bg-light d-flex flex-column align-items-center justify-items-center mr-1">
        <v-icon name="camera" scale="8.75" class="text-faded" />
        <b-btn
          variant="primary"
          size="lg"
          class="ml-3 mr-3"
          @click="photoAdd"
          @drop.prevent="drop"
          @dragover.prevent
        >
          Add photos
        </b-btn>
        <div v-if="uploading" class="bg-white">
          <OurFilePond
            ref="filepond"
            imgtype="Message"
            imgflag="message"
            :identify="true"
            :browse="pondBrowse"
            :multiple="true"
            @photoProcessed="photoProcessed"
            @allProcessed="allProcessed"
          />
        </div>
      </div>
      <div v-for="att in attachments" :key="'image-' + att.id" class="bg-transparent p-0">
        <PostPhoto v-bind="att" class="mr-1" @remove="removePhoto" />
      </div>
      <hr>
    </div>
    <div v-if="suggestions.length && !item.length">
      <b-card v-if="attachments.length" bg-variant="info" class="mb-1">
        <p>Based on your photo, here are possible suggestions you can click:</p>
        <b-btn v-for="suggestion in suggestions" :key="suggestion.id" variant="white" class="mr-1" @click="chooseSuggestion(suggestion)">
          {{ suggestion.name }}
        </b-btn>
      </b-card>
    </div>
    <div class="subject-layout mb-1">
      <b-input v-model="type" disabled class="type text-uppercase bg-white mt-1" size="lg" />
      <PostItem ref="item" v-model="item" class="item pt-1" @input="itemType" />
      <NumberIncrementDecrement v-if="type === 'Offer'" :count.sync="availablenow" label="Quantity" class="count pt-1" />
    </div>
    <div>
      <NoticeMessage v-if="vague" variant="warning" class="mt-1 mb-1">
        <p>
          Please avoid very general terms.  Be precise - you'll get a better response.
        </p>
      </NoticeMessage>
      <NoticeMessage v-if="warn" variant="warning" class="mt-1">
        <h1 class="header--size3">
          <v-icon name="info-circle" scale="1.75" /> {{ warn.type }}
        </h1>
        <p>
          {{ warn.message }}
        </p>
      </NoticeMessage>
    </div>
    <div>
      <b-form-textarea
        v-model="description"
        :placeholder="placeholder"
        rows="8"
      />
    </div>
  </div>
</template>

<script>
import NoticeMessage from './NoticeMessage'
import NumberIncrementDecrement from './NumberIncrementDecrement'
import waitForRef from '@/mixins/waitForRef'
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
  mixins: [waitForRef],
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
      suggestions: [],
      pondBrowse: true,
      vagueness: [
        'eney fink',
        'eney think',
        'furniture',
        'household',
        'anything',
        'stuff',
        'things',
        'tools',
        'garden',
        'goods',
        "don't know",
        'items',
        'browsing',
        'browse'
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
          if (item.indexOf(v) !== -1) {
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
        ? "Please give a few details, e.g. colour, condition, size, whether it's working etc."
        : "Please give a few more details about what you're looking for, and why you'd like it."
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
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb, image, ocr, suggestions) {
      // We have uploaded a photo.  Remove the filepond instance.
      const att = {
        id: imageid,
        paththumb: imagethumb,
        path: image
      }

      this.suggestions = suggestions

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
