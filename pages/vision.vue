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
        <ul>
          <li
            v-for="c in captures"
            :key="c.id"
          >
            <img
              :src="c.src"
              height="50"
            >
            <pre>{{ c.text }}</pre>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <b-button
        id="snap"
        variant="primary"
        @click="capture()"
      >
        Snap Photo
      </b-button>
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
  components: {},
  data() {
    return {
      captureDevice: {},
      video: {},
      canvas: {},
      captures: []
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
    capture: function() {
      const self = this

      if (this.captureDevice) {
        this.captureDevice
          .takePhoto()
          .then(blob => {
            this.captureDevice
              .grabFrame()
              .then(imageBitmap => {
                const imgsrc = this.canvas.toDataURL('image/png')

                const reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onloadend = function() {
                  const base64data = reader.result
                  console.log('BASE64', base64data.length, imgsrc.length)

                  const formData = new FormData()
                  formData.append('photo', base64data)

                  axios
                    .post(
                      'https://iznik.ilovefreegle.org/api/catalogue',
                      formData,
                      {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      }
                    )
                    .then(response => {
                      console.log('Response', response)
                      const result = response.data
                      if (result.ret === 0) {
                        self.captures.push({
                          id: self.captures.length,
                          src: imgsrc,
                          text: result.authors.join(',')
                          // result.text[0].description
                        })
                      }
                    })
                    .catch(self.stopCamera)
                }
              })
              .catch(err => console.log('Recognise failed', err))
          })
          .catch(err => {
            console.error('Failed', err)
            window.alert('Failed')
            this.stopCamera()
          })
      } else {
        alert('No device')
      }

      this.canvas = this.$refs.canvas
    },
    stopCamera() {
      if (this.captureDevice) {
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
