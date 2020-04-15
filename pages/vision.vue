<template>
  <div class="container">
    <h1>Booktastic Proof of Concept</h1>
    <div class="row">
      <div class="col-sm">
        <video
          id="video"
          ref="video"
          width="640"
          height="480"
          autoplay
        />
      </div>
      <div class="col-sm">
        <ul class="list-unstyled">
          <li
            v-for="b in books"
            :key="b.spine"
          >
            <img
              v-if="b.thumb"
              :src="b.thumb"
              height="50"
            >
            <div v-if="b.author">
              <v-icon name="check" class="text-success" /> {{ b.author }} - {{ b.title }}
            </div>
            <div v-else>
              <v-icon name="times" class="text-danger" /> {{ b.spine }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <SpinButton
        variant="primary"
        name="camera"
        label="Take Photo"
        :handler="capture"
      />
    </div>
    <canvas
      id="canvas"
      ref="canvas"
      width="640"
      height="480"
    />
  </div>
</template>

<script>
import SpinButton from '../components/SpinButton'
const axios = require('axios')

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
  components: { SpinButton },
  data() {
    return {
      captureDevice: {},
      video: {},
      canvas: {},
      books: []
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
    async capture() {
      const self = this

      this.books = []
      this.canvas = this.$refs.canvas

      if (this.captureDevice) {
        const blob = await this.captureDevice.takePhoto()
        await this.captureDevice.grabFrame()
        const base64data = await this.readFileAsync(blob)
        console.log('Got base64', base64data)
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
          self.books = rsp.books
          console.log('Got books', self.books)
        }
      } else {
        alert('No device')
      }
    },
    stopCamera() {
      if (this.captureDevice && this.captureDevice.stop) {
        this.captureDevice.stop()
      }
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
</style>
