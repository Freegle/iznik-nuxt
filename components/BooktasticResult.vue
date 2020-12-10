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
          <div v-else-if="result.spines.length" variant="info">
            <h3>We found {{ books.length | pluralize('book', { includeNumber: true }) }}</h3>
            <div>
              <p>
                Please rate how many we found:
              </p>
              <div class="d-flex">
                <SpinButton variant="primary" name="smile" label="Most or all" spinclass="text-white" :handler="most" />
                <SpinButton variant="secondary" name="meh" label="About half" :handler="some" />
                <SpinButton variant="warning" name="frown" label="Few or none" :handler="few" />
              </div>
            </div>
            <p>
              See other results and background info <nuxt-link to="/booktastic/results">
                here
              </nuxt-link>.
            </p>
            <p class="text-muted mt-2">
              The images are illustrative only and may be for a different editions.
            </p>
            <div class="d-flex flex-wrap">
              <BooktasticBook v-for="(book, index) in books" :key="'book-' + index" :book="book" class="mr-2" />
            </div>
          </div>
          <NoticeMessage v-else variant="warning">
            We couldn't find any books in this picture.
          </NoticeMessage>
        </b-card-body>
      </b-card>
      <h3>Debugging Info</h3>
      <div v-if="showSpines">
        <p class="mt-2">
          Click on one of the rectangles to see what we identified.
        </p>
        <b-btn variant="secondary" size="lg" class="mt-1 mb-1" @click="showSpines = false">
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
      <b-btn v-else variant="secondary" size="lg" class="mt-1 mb-1" @click="showSpines = true">
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
            @selected="selectBook"
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
import waitForRef from '@/mixins/waitForRef'
import NoticeMessage from './NoticeMessage'
import SpinButton from './SpinButton'
import BooktasticBook from './BooktasticBook'

const a = require('axios')
const axios = a.create({
  timeout: 300000
})

export default {
  components: { BooktasticBook, SpinButton, NoticeMessage },
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
    },
    id: {
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
      // return 1
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
            let found = false

            this.unusedFragments.forEach(f => {
              if (f.spineindex === i) {
                const poly = f.boundingPoly
                const vs = poly.vertices
                vs.forEach(v => {
                  minx = Math.min(minx, v.x)
                  miny = Math.min(miny, v.y)
                  maxx = Math.max(maxx, v.x)
                  maxy = Math.max(maxy, v.y)
                  found = true
                })
              }
            })

            if (found) {
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
      }

      console.log('No books', ret)
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

            const thisone = this.result.spines[i]

            thisone.top = miny
            thisone.left = minx
            thisone.width = maxx - minx
            thisone.height = maxy - miny

            ret.push(thisone)
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
    selectBook(e) {
      console.log('Selected book', e)
      const id = e.id.substring(e.id.indexOf('-') + 1)
      this.selectedSpine = this.books[id]
      console.log('Selected spine', this.selectedSpine)
    },
    most() {
      this.rate(3)
    },
    some() {
      this.rate(2)
    },
    few() {
      this.rate(1)
    },
    async rate(rating) {
      const formData = new FormData()
      formData.append('id', this.id)
      formData.append('rating', rating)
      formData.append('action', 'Rate')

      await axios.post(process.env.API + '/catalogue', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
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
