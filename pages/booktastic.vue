<template>
  <div class="container">
    <h1>
      Booktastic Proof of Concept
    </h1>
    <div v-if="!result">
      <b-card no-body>
        <b-card-body>
          <p>
            Take a closeup of a bookshelf.  You're aiming for something like this:
          </p>
          <b-img src="~/static/booktastic.jpg" thumbnail class="smallimg mb-2" />
          <p>
            We'll try to identify the books.
          </p>
          <NoticeMessage variant="info">
            <ul>
              <li>
                We won't get them all - right now around half is pretty good going.
              </li>
              <li>
                It's <b>very</b> slow - around 60 seconds to process after upload.  Don't worry about that - it'll
                get usably fast later.
              </li>
              <li>
                This won't look good on mobile yet.
              </li>
            </ul>
          </NoticeMessage>
        </b-card-body>
      </b-card>
      <div class="d-flex justify-content-between flex-wrap">
        <SpinButton
          variant="primary"
          name="camera"
          label="Take Photo"
          :handler="capture"
          size="lg"
          class="mt-2"
        />
        <b-btn
          variant="success"
          size="lg"
          class="mt-2"
          @click="startUpload"
        >
          <v-icon name="camera" />&nbsp;Add photo
        </b-btn>
      </div>
      <file-pond
        v-if="uploading"
        ref="pond"
        name="photo"
        :allow-multiple="false"
        accepted-file-types="image/jpeg, image/png, image/gif, image/jpg"
        :files="myFiles"
        image-crop-aspect-ratio="1"
        label-idle="<span class=&quot;btn btn-success&quot;>&nbsp;Upload&nbsp;Photo </span>"
        :server="{ process, revert, restore, load, fetch }"
        @init="photoInit"
        @processfile="processed"
      />
      <!--      Don't resize as we need all the resolution we can get for better OCR-->
      <!--        :image-resize-target-width="width"-->
      <!--        :image-resize-target-height="height"-->
    </div>
    <b-btn v-if="result" variant="white" class="mt-2 mb-2" size="lg" @click="again">
      Try Again
    </b-btn>
    <client-only>
      <BooktasticResult v-if="result" :photo="photo" :result="result" :width="width" :height="height" />
    </client-only>
    <div v-if="processing" class="w-100 d-flex justify-content-center">
      <div class="d-flex flex-column">
        <h4>Crunching...</h4>
        <div>
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </div>
      </div>
    </div>
    <video
      v-if="!uploading && !processing && !result"
      id="video"
      ref="video"
      class="mt-2"
      :width="width"
      :height="height"
      autoplay
    />
    <canvas
      id="canvas"
      ref="canvas"
      :width="width"
      :height="height"
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
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import SpinButton from '../components/SpinButton'
import BooktasticResult from '../components/BooktasticResult'
import NoticeMessage from '../components/NoticeMessage'
import waitForRef from '@/mixins/waitForRef'

const a = require('axios')
const axios = a.create({
  timeout: 300000
})

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize,
  FilePondPluginImageExifOrientation
)

export default {
  head: {
    title: 'Capture',
    script: [{}],
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Capture books from camera'
      }
    ]
  },
  components: { NoticeMessage, BooktasticResult, SpinButton, FilePond },
  mixins: [waitForRef],
  data() {
    return {
      width: 1024,
      height: 768,
      captureDevice: {},
      video: {},
      canvas: {},
      myFiles: [],
      photo: null,
      result: null,
      uploading: false,
      processing: false,
      timeout: 3000,
      requestId: null
    }
  },
  mounted: function() {
    let videoDevice
    this.video = this.$refs.video

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'environment'
        }
      })
      .then(mediaStream => {
        // Set it playing onscreen.
        this.video.srcObject = mediaStream
        this.video.play()

        // Extract video track.
        videoDevice = mediaStream.getVideoTracks()[0]

        // Check if this device supports a picture mode...
        this.captureDevice = new ImageCapture(videoDevice)
      })
      .catch(err => this.stopCamera(err))
  },
  beforeDestroy() {
    this.stopCamera()
  },
  methods: {
    readFileAsync(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = () => {
          resolve(reader.result)
        }

        reader.onerror = reject

        reader.readAsDataURL(blob)
      })
    },
    async upload(file) {
      const base64data = await this.readFileAsync(file)
      const formData = new FormData()
      formData.append('photo', base64data)
      let response = null
      this.photo = base64data

      response = await axios.post(
        'https://iznik.ilovefreegle.org/api/catalogue',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      this.processing = true
      const rsp = response.data
      console.log('Response', rsp)

      if (rsp.ret === 0) {
        this.requestId = rsp.id
        console.log('Queued as', this.requestId)
        this.checkResult()
      }
    },
    async checkResult() {
      console.log('Check request', this.requestId)
      const response = await axios.get(
        'https://iznik.ilovefreegle.org/api/catalogue',
        {
          params: {
            id: this.requestId
          }
        }
      )

      const rsp = response.data

      if (rsp.ret === 0 && rsp.spines && rsp.spines.length) {
        console.log('Completed')
        this.processing = false
        this.result = rsp
      } else {
        this.timeout--

        if (--this.timeout > 0) {
          setTimeout(this.checkResult, 1000)
        } else {
          console.log('Gave up')
        }
      }
    },
    async capture() {
      this.canvas = this.$refs.canvas

      if (this.captureDevice) {
        const capabilities = await this.captureDevice.getPhotoCapabilities()
        console.log('Capabilities', capabilities)
        const blob = await this.captureDevice.takePhoto()
        await this.captureDevice.grabFrame()
        this.upload(blob)
      } else {
        alert('No device')
      }
    },
    stopCamera() {
      if (this.captureDevice && this.captureDevice.stop) {
        this.captureDevice.stop()
      }
    },
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
    process(fieldName, file, metadata, load, error, progress, abort) {
      this.upload(file).then(() => {
        this.uploading = false
      })

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
    processed() {},

    addFile(f) {
      this.$refs.pond.addFile(f)
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
    again() {
      this.photo = null
      this.result = null
      this.timeout = 300
      this.uploading = false
      this.processing = false
    },
    startUpload() {
      this.uploading = true
      this.waitForRef('pond', () => {
        this.$refs.pond.browse()
      })
    }
  }
}
</script>
<style>
body {
  background-color: #f0f0f0;
}

#video {
  background-color: #000000;
}

#canvas {
  display: none;
}

.smallimg {
  max-width: 200px;
}
</style>
