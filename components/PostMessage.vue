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
        <file-pond
          ref="pond"
          name="photo"
          allow-multiple="false"
          accepted-file-types="image/jpeg, image/png, image/gif, image/jpg"
          :files="myFiles"
          image-resize-target-width="800"
          image-resize-target-height="800"
          image-crop-aspect-ratio="1"
          label-idle="Drag & Drop photos or <span class=&quot;btn btn-white ction&quot;> Browse </span>"
          :server="{ process, revert, restore, load, fetch }"
          @init="photoInit"
          @processfile="photoProcessed"
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
      </b-col>
    </b-row>
    <b-row>
      <b-col class="pl-0 pr-0">
        <PostItem :key="item" :item="item" @selected="itemSelect" @cleared="itemClear" @typed="itemType" />
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
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
const vueFilePond = () => import('vue-filepond')
const FilePondPluginFileValidateType = () =>
  import('filepond-plugin-file-validate-type')
const FilePondPluginImagePreview = () => import('filepond-plugin-image-preview')
const FilePondPluginImageTransform = () =>
  import('filepond-plugin-image-transform')
const PostPhoto = () => import('~/components/PostPhoto')
const PostItem = () => import('~/components/PostItem')

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform
)

export default {
  components: {
    FilePond,
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
    photoInit: function() {
      // We have rendered the filepond instance.  Trigger browse so that they can upload a photo without an
      // extra click.
      this.$refs.pond.browse()
    },
    photoProcessed(error, file) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.$store.dispatch('compose/addAttachment', {
        id: this.id,
        attachment: this.image
      })

      // The imageid is in this.imageid.  Store it.
      if (error) {
        // TODO
      }
    },
    async process(fieldName, file, metadata, load, error, progress, abort) {
      const data = new FormData()
      data.append('photo', file, 'photo')
      data.append('message', true)
      data.append('imgtype', 'Message')

      const ret = await this.$axios.post(process.env.API + '/image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUpLoadProgress: e => {
          progress(e.lengthComputable, e.loaded, e.total)
        }
      })

      if (ret.status === 200 && ret.data.ret === 0) {
        this.image = {
          id: ret.data.id,
          paththumb: ret.data.paththumb,
          path: ret.data.path
        }

        load(ret.data.id)
      } else {
        error(
          ret.status === 200 ? ret.data.status : 'Network error ' + ret.status
        )
      }

      return {
        abort: () => {
          // We don't need to do anything - the server will tidy up hanging images.
          abort()
        }
      }
    },
    load(uniqueFileId, load, error) {},
    fetch(url, load, error, progress, abort, headers) {},
    restore(uniqueFileId, load, error, progress, abort, headers) {},
    revert(uniqueFileId, load, error) {},
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
