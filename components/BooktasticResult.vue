<template>
  <div>
    <client-only>
      <b-card no-body>
        <b-card-body>
          <div v-if="selectedSpine">
            <div v-if="selectedSpine.author">
              <p>This is what we think it is:</p>
              Author: <b>{{ selectedSpine.author }}</b> <br>
              Title: <b>{{ selectedSpine.title }}</b>
            </div>
            <div v-else>
              <p>We couldn't identify this one.  This is the text we found:</p>
              <b>{{ selectedSpine.spine }}</b>
            </div>
          </div>
          <NoticeMessage v-else-if="result.spines.length" variant="info">
            <h3>We found {{ books.length | pluralize('book', { includeNumber: true }) }}</h3>
            <p>
              Click on one of the rectangles to see what we identified.
            </p>
          </NoticeMessage>
          <NoticeMessage v-else variant="warning">
            We couldn't find any books in this picture.
          </NoticeMessage>
        </b-card-body>
      </b-card>
      <div v-if="showSpines">
        <b-btn variant="white" size="lg" @click="showSpines = false">
          Hide text
        </b-btn>
        <ul v-if="result && result.spines" class="list-unstyled mt-2">
          <li v-for="(b, index) in result.spines" :key="'spine-' + index">
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
      </div>
      <b-btn v-else variant="white" size="lg" class="mt-1 mb-1" @click="showSpines = true">
        Show text
      </b-btn>
      <div id="container" class="position-relative bg-white">
        <b-img v-if="photo" ref="img" :src="photo" class="position-absolute img" :style="'zoom: ' + zoom" />
        <fabric-canvas
          v-if="bump"
          ref="canvas"
          background-color="transparent"
          class="position-absolute canvas"
          :width="naturalWidth"
          :height="naturalHeight"
        >
          <fabric-rectangle
            v-for="(fragment, index) in books"
            :id="'book-' + index"
            :key="'book-' + index + '-' + bump"
            fill="transparent"
            :top="fragment.top"
            :left="fragment.left"
            :height="fragment.height"
            :width="fragment.width"
            stroke="green"
            :stroke-width="3 / zoom"
            lock-movement-x
            lock-movement-y
            lock-scaling-x
            lock-scaling-y
            @selected="selectUsed"
          />
          <fabric-rectangle
            v-for="(fragment, index) in nobooks"
            :id="'fragment-' + index"
            :key="'fragment2-' + index + '-' + bump"
            fill="transparent"
            :top="fragment.top"
            :left="fragment.left"
            :height="fragment.height"
            :width="fragment.width"
            stroke="orange"
            :stroke-width="3 / zoom"
            lock-movement-x
            lock-movement-y
            lock-scaling-x
            lock-scaling-y
            @selected="selectUnused"
          />
        </fabric-canvas>
      </div>
    </client-only>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { NoticeMessage },
  mixins: [waitForRef],
  props: {
    photo: {
      type: String,
      required: true
    },
    result: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      selectedSpine: null,
      showSpines: false,
      naturalHeight: 1,
      naturalWidth: 1,
      bump: 0
    }
  },
  computed: {
    url() {
      let ret = null

      if (this.photo) {
        ret = this.photo
      }

      return ret
    },
    image() {
      if (this.url && process.client) {
        const image = new Image()
        image.src = this.url
        return image
      }

      return null
    },
    requiredWidth() {
      return Math.min(this.naturalWidth, this.width)
    },
    zoom() {
      return Math.min(
        this.width / this.naturalWidth,
        this.height / this.naturalHeight
      )
    },
    fragments() {
      const ret = []

      if (this.result && this.result.fragments) {
        this.result.fragments.forEach(f => {
          // Set top, left, height, width.
          const poly = f.boundingPoly
          const vs = poly.vertices

          let minx = 1000000
          let miny = 1000000
          let maxx = -1000000
          let maxy = -1000000

          vs.forEach(v => {
            minx = Math.min(minx, v.x)
            miny = Math.min(miny, v.y)
            maxx = Math.max(maxx, v.x)
            maxy = Math.max(maxy, v.y)
          })

          // Need to scale - the values above relate to the natural size of the image, whereas we show a scaled
          // version
          const x = this.naturalWidth
          const y = this.naturalHeight

          maxy = Math.round((maxy * this.height) / y)
          miny = Math.round((miny * this.height) / y)
          minx = Math.round((minx * this.width) / x)
          maxx = Math.round((maxx * this.width) / x)

          f.top = miny
          f.left = minx
          f.width = maxx - minx
          f.height = maxy - miny

          ret.push(f)
        })
      }

      console.log('Fragments', ret)

      return ret
    },
    unusedFragments() {
      return this.fragments.filter(f => {
        return !f.used
      })
    },
    usedFragments() {
      return this.fragments.filter(f => {
        return f.used
      })
    },
    nobooks() {
      const ret = []

      if (this.result && this.result.spines) {
        for (let i = 0; i < this.result.spines.length; i++) {
          if (!this.result.spines[i].author) {
            let minx = 1000000
            let miny = 1000000
            let maxx = -1000000
            let maxy = -1000000

            this.unusedFragments.forEach(f => {
              if (f.spineindex === i) {
                const poly = f.boundingPoly
                const vs = poly.vertices
                vs.forEach(v => {
                  minx = Math.min(minx, v.x)
                  miny = Math.min(miny, v.y)
                  maxx = Math.max(maxx, v.x)
                  maxy = Math.max(maxy, v.y)
                })
              }
            })

            ret.push({
              top: miny,
              left: minx,
              width: maxx - minx,
              height: maxy - miny,
              spineindex: i
            })
          }
        }
      }

      console.log('Books', ret)
      return ret
    },
    books() {
      const ret = []

      if (this.result && this.result.spines) {
        for (let i = 0; i < this.result.spines.length; i++) {
          if (this.result.spines[i].author) {
            let minx = 1000000
            let miny = 1000000
            let maxx = -1000000
            let maxy = -1000000

            this.usedFragments.forEach(f => {
              if (f.spineindex === i) {
                const poly = f.boundingPoly
                const vs = poly.vertices
                vs.forEach(v => {
                  minx = Math.min(minx, v.x)
                  miny = Math.min(miny, v.y)
                  maxx = Math.max(maxx, v.x)
                  maxy = Math.max(maxy, v.y)
                })
              }
            })

            ret.push({
              top: miny,
              left: minx,
              width: maxx - minx,
              height: maxy - miny,
              spineindex: i
            })
          }
        }
      }

      console.log('Books', ret)
      return ret
    }
  },
  watch: {
    zoom(newval) {
      this.waitForRef('canvas', () => {
        this.$refs.canvas.canvas.setZoom(newval)
      })
    }
  },
  mounted() {
    this.sendImageToBack()
    this.waitForRef('img', () => {
      this.naturalHeight = this.$refs.img.naturalHeight
      this.naturalWidth = this.$refs.img.naturalWidth
      setTimeout(() => {
        this.sendImageToBack()
        this.bump++
      }, 500)
    })
  },
  methods: {
    sendImageToBack() {
      this.waitForRef('image', () => {
        this.$refs.image.sendToBack()
      })
    },
    selectUnused(e) {
      console.log('Selected unused', e)
      const id = e.id.substring(e.id.indexOf('-') + 1)
      this.selectedSpine = this.result.spines[this.nobooks[id].spineindex]
      console.log('Selected spine', this.selectedSpine)
    },
    selectUsed(e) {
      console.log('Selected used', e)
      const id = e.id.substring(e.id.indexOf('-') + 1)
      this.selectedSpine = this.result.spines[this.books[id].spineindex]
      console.log('Selected spine', this.selectedSpine)
    }
  }
}
</script>
<style scoped>
.img {
  top: 0;
  left: 0;
  z-index: 100;
  opacity: 0.75;
}

.canvas {
  top: 0;
  left: 0;
  z-index: 200;
}
</style>
