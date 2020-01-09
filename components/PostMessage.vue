<template>
  <div>
    <b-row class="pr-0 mb-2">
      <b-col cols="6" md="0" class="mt-2 pl-0">
        <b-form-select v-model="type" size="lg" class="d-inline-block d-md-none">
          <option value="Offer">
            OFFER
          </option>
          <option value="Wanted">
            WANTED
          </option>
        </b-form-select>
      </b-col>
      <b-col cols="6" md="12" class="pl-0">
        <b-btn
          variant="success"
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
    <b-row v-if="suggestions.length">
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
        <b-form-select v-model="type" readonly>
          <option value="Offer" :disabled="type !== 'Offer'">
            OFFER
          </option>
          <option value="Wanted" :disabled="type !== 'Wanted'">
            WANTED
          </option>
        </b-form-select>
      </b-col>
      <b-col cols="12" md="9" class="pl-0 pr-0">
        <PostItem ref="item" :item="item" @selected="itemSelect" @cleared="itemClear" @typed="itemType" />
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
const OurFilePond = () => import('~/components/OurFilePond')
const PostPhoto = () => import('~/components/PostPhoto')
const PostItem = () => import('~/components/PostItem')

export default {
  components: {
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
      suggestions: [],
      pondBrowse: true
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
    description: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage'](this.id)
        return msg ? msg.description : null
      },
      set: function(newValue) {
        this.$store.dispatch('compose/setDescription', {
          id: this.id,
          description: newValue
        })
      }
    },
    attachments() {
      return this.$store.getters['compose/getAttachments'](this.id)
    },
    placeholder() {
      const msg = this.$store.getters['compose/getMessage'](this.id)
      return msg && msg.type === 'Offer'
        ? 'Please give a few details if possible, e.g. colour, condition, size etc.'
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
      this.item = value
      this.$store.dispatch('compose/setItem', {
        id: this.id,
        item: this.item,
        type: this.type
      })
    },
    itemSelect(item) {
      this.item = item.name
      this.$store.dispatch('compose/setItem', {
        id: this.id,
        item: this.item,
        type: this.type
      })
    },
    itemClear() {
      this.item = null
      this.uploading = false
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
      setTimeout(() => {
        ;[...droppedFiles].forEach(f => {
          this.$refs.filepond.addFile(f)
        })
      }, 500)
    }
  }
}
</script>
