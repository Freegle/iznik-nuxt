<template>
  <div>
    <file-pond
      ref="pond"
      name="photo"
      :allow-multiple="multiple"
      accepted-file-types="image/jpeg, image/png, image/gif, image/jpg"
      :files="myFiles"
      image-resize-target-width="800"
      image-resize-target-height="800"
      image-crop-aspect-ratio="1"
      label-idle="Drag & Drop photos or <span class=&quot;btn btn-white&quot;> Browse </span>"
      :server="{ process, revert, restore, load, fetch }"
      @init="photoInit"
      @processfile="processed"
      @processfiles="allProcessed"
    />
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
import { mobilestate } from '@/plugins/app-init-push' // CC

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize
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
    }
  },
  data: function() {
    return {
      imageid: null,
      imagethumb: null,
      image: null,
      ocred: null,
      identified: null,
      myFiles: []
    }
  },
  methods: {
    takeAndroidPhoto: function () { // CC
      const maxDimension = 800
      navigator.camera.getPicture(imageURI => {
          this.cameraSuccess(imageURI)
        }, msg => {
          this.cameraError(msg)
        },
        {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          //destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          //allowEdit: true,	// Don't: adds unhelpful crop photo step
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: maxDimension,
          targetHeight: maxDimension,
          //popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true,
          correctOrientation: true
        }
      )
    },
    cameraError: function (msg) {
      setTimeout(function () {
        if (msg === "No Image Selected") { msg = "No photo taken or chosen" }
        if (msg === "Camera cancelled") { msg = "No photo taken or chosen" }
        console.log(msg)
      }, 0)
    },
    cameraSuccess: function (imageData) {
      console.log("cameraSuccess size:" + imageData.length)
      const contentType = 'image/jpeg'
      const sliceSize = 512

      const byteCharacters = atob(imageData)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize)

        let byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        let byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      const imageBlob = new Blob(byteArrays, { type: contentType })

      this.$refs.pond.addFile(imageBlob)
    },
    photoInit: function () {
      console.log('photoInit') // CC
      if (process.env.IS_APP) {
        if (mobilestate.isiOS) {
          this.$refs.pond.labelIdle = '<span class="filepond--label-action btn btn-white">Take a photo or Browse</span>'
        } else {
          this.$refs.pond.labelIdle = '<span class="take-photo btn btn-default">Take Photo</span> or <span class="btn btn-white">Browse</span>'
          setTimeout(() => { // this.$nextTick didn't work
            const takePhoto = this.$el.querySelector('.take-photo')
            takePhoto.addEventListener('click', e => {
              this.takeAndroidPhoto()
              e.preventDefault()
              return false
            })
          }, 1000)
          if (this.browse) {
            this.takeAndroidPhoto()
          }
        }
      }
      else if (this.browse) {
        // We have rendered the filepond instance.  Trigger browse so that they can upload a photo without an
        // extra click.
        this.$refs.pond.browse()
      }
    },
    async process(fieldName, file, metadata, load, error, progress, abort) {
      await this.$store.dispatch('compose/setUploading', true)

      const data = new FormData()
      data.append('photo', file, 'photo')
      data.append(this.imgflag, true)
      data.append('imgtype', this.imgtype)
      data.append('ocr', this.ocr)
      data.append('identify', this.identify)
      if (this.msgid) {
        data.append('msgid', this.msgid)
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
        console.log('process Error',ret)
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
        console.log('processed Error', error)
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
    }
  },
  blockkey(e) {
    // We're blocking all interaction with this div while the load happens.
    e.returnValue = false
    return false
  }
}
</script>
