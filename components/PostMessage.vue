<template>
  <div>
    <b-row class="pr-0">
      <b-col cols="auto" class="mt-2 pl-0">
        <b-btn variant="success" size="lg" @click="photoAdd">
          <v-icon name="camera" />&nbsp;Add photos
        </b-btn>
      </b-col>
      <b-col class="text-center mt-2 pr-0">
        <b-alert variant="info" class="d-none d-md-inline-block float-right" show>
          <v-icon name="info-circle" />&nbsp;Please add photos - you'll get a better response.
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="uploading" class="bg-white">
      <b-col class="p-0">
        <OurFilePond
          imgtype="Message"
          imgflag="message"
          @photoProcessed="photoProcessed"
        />
      </b-col>
    </b-row>
    <b-row v-if="attachments && attachments.length">
      <b-col class="p-0">
        <b-list-group horizontal class="mb-1">
          <b-list-group-item v-for="(att, $index) in attachments" :key="'image-' + $index" class="bg-transparent p-0">
            <PostPhoto v-bind="att" @remove="removePhoto" />
          </b-list-group-item>
        </b-list-group>
        <hr>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6" md="3" class="pl-0">
        <b-form-select v-model="type">
          <option value="Offer">
            OFFER
          </option>
          <option value="Wanted">
            WANTED
          </option>
        </b-form-select>
      </b-col>
      <b-col cols="9" class="pl-0 pr-0">
        <PostItem :item="item" @selected="itemSelect" @cleared="itemClear" @typed="itemType" />
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
      image: null
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
    photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.image = {
        id: imageid,
        paththumb: imagethumb,
        path: image
      }

      this.$store.dispatch('compose/addAttachment', {
        id: this.id,
        attachment: this.image
      })
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
    }
  }
}
</script>
