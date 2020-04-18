<template>
  <div class="container">
    <h1>
      Booktastic Proof of Concept
    </h1>
    <b-card no-body>
      <b-card-body>
        <p>
          Take a photo of your bookshelf, or upload one.  You're aiming for something like this:
        </p>
        <b-img src="~/static/booktastic.jpg" thumbnail class="smallimg mb-2" />
        <p>
          We'll try to identify the books.  We won't get them all - right now around half is pretty good going.
        </p>
      </b-card-body>
    </b-card>
    <b-row>
      <b-col cols="6">
        <SpinButton
          variant="primary"
          name="camera"
          label="Take Photo"
          :handler="capture"
          class="mt-2"
        />
      </b-col>
      <b-col cols="6">
        <file-pond
          v-if="!books.length"
          ref="pond"
          name="photo"
          :allow-multiple="false"
          accepted-file-types="image/jpeg, image/png, image/gif, image/jpg"
          :files="myFiles"
          image-resize-target-width="1024"
          image-resize-target-height="768"
          image-crop-aspect-ratio="1"
          label-idle="<span class=&quot;btn btn-success&quot;>&nbsp;Upload&nbsp;Photo </span>"
          :server="{ process, revert, restore, load, fetch }"
          @init="photoInit"
          @processfile="processed"
        />
      </b-col>
    </b-row>
    <video
      v-if="!books.length"
      id="video"
      ref="video"
      width="1024"
      height="768"
      autoplay
    />
    <b-row>
      <b-col cols="12" lg="6">
        <b-img v-if="photo" :src="photo" class="mt-2" thumbnail />
      </b-col>
      <b-col cols="12" lg="6">
        <ul class="list-unstyled mt-2">
          <li v-for="b in books" :key="b.spine">
            <b-img
              v-if="b.thumb"
              :src="b.thumb"
              height="50"
            />
            <div v-if="b.author">
              <v-icon name="check" class="text-success" /> {{ b.author }} - {{ b.title }}
            </div>
            <div v-else>
              <v-icon name="times" class="text-danger" /> {{ b.spine }}
            </div>
          </li>
        </ul>
      </b-col>
    </b-row>
    <b-btn variant="white" class="mt-2" size="lg" @click="again">
      Try Again
    </b-btn>
    <canvas
      id="canvas"
      ref="canvas"
      width="640"
      height="480"
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
const axios = require('axios')

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
  components: { SpinButton, FilePond },
  data() {
    return {
      captureDevice: {},
      video: {},
      canvas: {},
      books: [],
      myFiles: [],
      photo: null
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
        console.log('Read file')
        const reader = new FileReader()

        reader.onloadend = () => {
          console.log('Load end')
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

      const response = await axios.post(
        'https://iznik.ilovefreegle.org/api/catalogue',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log('Response', response)
      const rsp = response.data

      if (rsp.ret === 0) {
        this.photo = base64data
        this.books = rsp.books
        console.log('Got books', this.books)
      }
    },
    async capture() {
      this.books = []
      this.canvas = this.$refs.canvas

      if (this.captureDevice) {
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
      this.upload(file)

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
      this.books = []
      this.photo = null
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
