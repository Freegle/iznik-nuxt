<template>
  <div>
    <b-row class="pr-0 mb-2">
      <b-col cols="6" md="0" class="mt-2 pl-0">
        <b-input v-model="type" size="lg" disabled class="d-inline-block d-md-none text-uppercase bg-white" />
      </b-col>
      <b-col cols="6" md="12" class="pl-0">
        <b-btn
          variant="primary"
          size="lg"
          class="mt-2"
          @click="photoAdd"
          @drop.prevent="drop"
          @dragover.prevent
        >
          <v-icon name="camera" />&nbsp;Add photos
        </b-btn>
      </b-col>
    </b-row>
    <b-row v-if="uploading" class="bg-white">
      <b-col class="p-0">
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
      </b-col>
    </b-row>
    <b-row v-if="attachments && attachments.length">
      <b-col class="p-0">
        <b-list-group horizontal class="mb-1">
          <b-list-group-item v-for="att in attachments" :key="'image-' + att.id" class="bg-transparent p-0">
            <PostPhoto v-bind="att" @remove="removePhoto" />
          </b-list-group-item>
        </b-list-group>
        <hr>
      </b-col>
    </b-row>
    <b-row v-if="suggestions.length && !item.length">
      <b-col>
        <b-card v-if="attachments.length" bg-variant="info" class="mb-1">
          <p>Based on your photo, here's what we think it might be.  Click to choose.</p>
          <b-btn v-for="suggestion in suggestions" :key="suggestion.id" variant="white" class="mr-1" @click="chooseSuggestion(suggestion)">
            {{ suggestion.name }}
          </b-btn>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="0" md="3" class="pl-0 d-none d-md-inline-block">
        <b-input v-model="type" disabled class="text-uppercase bg-white" />
      </b-col>
      <b-col cols="12" md="9" class="pl-0 pr-0">
        <PostItem ref="item" v-model="item" @input="itemType" />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="pl-0 pr-0">
        <NoticeMessage v-if="vague" variant="warning" class="mt-1">
          <p>
            Please avoid very general terms.  Be precise - you'll get a better response.
          </p>
          <p v-if="me">
            If you just want to see what's happening, please go to
            <!-- eslint-disable-next-line -->
            <nuxt-link to="/browse">Browse</nuxt-link>.
            If you want to search for something specific, please go
            <!-- eslint-disable-next-line -->
            <nuxt-link to="/find/search">here</nuxt-link>.
          </p><p v-else>
            If you just want to see what's happening, please go to
            <!-- eslint-disable-next-line -->
            <nuxt-link to="/explore">Explore</nuxt-link>.
            If you want to search for something specific, please go
            <!-- eslint-disable-next-line -->
            <nuxt-link to="/find/search">here</nuxt-link>.
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
      </b-col>
    </b-row>
    <b-row>
      <b-col class="pl-0 pt-1 pr-0">
        <b-form-textarea
          v-model="description"
          :placeholder="placeholder"
          rows="8"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NoticeMessage from './NoticeMessage'
import waitForRef from '@/mixins/waitForRef'
const OurFilePond = () => import('~/components/OurFilePond')
const PostPhoto = () => import('~/components/PostPhoto')
const PostItem = () => import('~/components/PostItem')

export default {
  components: {
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
    item: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage'](this.id)
        return msg && msg.item ? msg.item : ''
      },
      set: function(newValue) {
        this.$store.dispatch('compose/setItem', {
          id: this.id,
          item: newValue,
          type: this.type
        })
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
      return this.$store.getters['compose/getAttachments'](this.id)
    },
    placeholder() {
      return this.type === 'Offer'
        ? "Please give a few details, e.g. colour, condition, size, whether it's working etc."
        : "Please give a few more details about what you're looking for, and why you'd like it."
    }
  },
  methods: {
    save() {
      this.$store.dispatch('compose/setMessage', {
        id: this.id,
        item: this.item,
        description: this.description,
        type: 'Offer'
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
          type: this.type
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
        type: this.type
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
