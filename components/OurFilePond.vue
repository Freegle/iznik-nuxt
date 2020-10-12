<template>
  <div>
    <file-pond
      v-if="supported"
      ref="pond"
      name="photo"
      :allow-multiple="multiple"
      accepted-file-types="image/jpeg, image/png, image/gif, image/jpg, image/heic"
      :file-validate-type-detect-type="validateType"
      :files="myFiles"
      image-resize-target-width="800"
      image-resize-target-height="800"
      image-crop-aspect-ratio="1"
      label-idle="Drag & Drop photos or <span class=&quot;btn btn-white ction&quot;> Browse </span>"
      :server="{ process, revert, restore, load, fetch }"
      @init="photoInit"
      @processfile="processed"
      @processfiles="allProcessed"
    />
    <div v-else>
      Sorry, photo uploads aren't supported on this browser.  Maybe it's old?
    </div>
  </div>
</template>
<script>
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

let heic2any = null

if (process.client) {
  heic2any = require('heic2any')
}

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize,
  FilePondPluginImageExifOrientation
)

export default {
  components: {
    FilePond
  },
  props: {
    imgtype: {
      type: String,
      required: true
    },
    imgflag: {
      type: String,
      required: true
    },
    ocr: {
      type: Boolean,
      required: false,
      default: false
    },
    identify: {
      type: Boolean,
      required: false,
      default: false
    },
    browse: {
      type: Boolean,
      required: false,
      default: true
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    msgid: {
      type: Number,
      required: false,
      default: null
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      imageid: null,
      imagethumb: null,
      image: null,
      ocred: null,
      identified: null,
      myFiles: [],
      supported: true
    }
  },
  methods: {
    photoInit: function() {
      if (!this.$refs.pond._pond) {
        // This is the only way of finding out if the browser is supported - see
        // https://github.com/pqina/vue-filepond/issues/136
        this.supported = false
      } else if (this.browse) {
        // We have rendered the filepond instance.  Trigger browse so that they can upload a photo without an
        // extra click.
        this.$refs.pond.browse()
      }
    },
    async process(fieldName, file, metadata, load, error, progress, abort) {
      await this.$store.dispatch('compose/setUploading', true)

      const data = new FormData()
      const fn = file.name.toLowerCase()

      if (fn.indexOf('.heic') !== -1) {
        // If we have an HEIC file, then the server can't cope with it as it will fail imagecreatefromstring, so
        // convert it to a PNG file on the client before upload.
        const blob = file.slice(0, file.size, 'image/heic')
        const png = await heic2any({ blob })
        data.append('photo', png, 'photo')
      } else {
        data.append('photo', file, 'photo')
      }

      data.append(this.imgflag, true)
      data.append('imgtype', this.imgtype)
      data.append('ocr', this.ocr)
      data.append('identify', this.identify)

      if (this.msgid) {
        data.append('msgid', this.msgid)
      } else if (this.groupid) {
        data.append('groupid', this.groupid)
      }

      const ret = await this.$axios.post(process.env.API + '/image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUpLoadProgress: e => {
          progress(e.lengthComputable, e.loaded, e.total)
        }
      })

      if (ret.status === 200 && ret.data.ret === 0) {
        this.imageid = ret.data.id
        this.imagethumb = ret.data.paththumb
        this.image = ret.data.path

        if (this.ocr) {
          this.ocred = ret.data.ocr
        }

        if (this.identify) {
          this.identified = ret.data.items
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

    processed(error, file) {
      if (error) {
      } else {
        this.$emit(
          'photoProcessed',
          this.imageid,
          this.imagethumb,
          this.image,
          this.ocred,
          this.identified
        )

        if (!this.multiple) {
          // Only one, so the allProcessed event isn't fired by pond.
          this.allProcessed()
        }
      }
    },

    addFile(f) {
      this.$refs.pond.addFile(f)
    },

    async allProcessed() {
      this.$emit('allProcessed')
      await this.$store.dispatch('compose/setUploading', false)
    },

    detector(source, type) {
      // This function is never executed...
      return new Promise((resolve, reject) => {
        console.log(source, type)
        if (source.name.indexOf('.heic') !== -1) {
          // This is not detected automatically.
          type = 'image/heic'
        }

        resolve(type)
      })
    },
    validateType(source, type) {
      const p = new Promise((resolve, reject) => {
        // Not all browsers set the MIME type correctly, so we have a custom validator to force it from the filename.
        if (source.name.toLowerCase().indexOf('.heic') !== -1) {
          resolve('image/heic')
        } else {
          resolve(type)
        }
      })

      return p
    }
  },
  blockkey(e) {
    // We're blocking all interaction with this div while the load happens.
    e.returnValue = false
    return false
  }
}
</script>
