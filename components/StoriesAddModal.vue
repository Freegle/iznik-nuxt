<template>
  <b-modal
    id="storyaddemodal"
    v-model="showModal"
    :title="thankyou ? 'Thank you!' : 'Your Story'"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <div v-if="thankyou">
        <p>We're grateful that you've taken the time.  Happy freegling!</p>
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <p>First, please could we have a quick summary?</p>
            <b-form-input v-model="story.headline" spellcheck="true" maxlength="140" placeholder="Give us a soundbite!" class="mb-1" />
            <h3>Your story</h3>
            <p>Ok, now tell us why you freegle!</p>
            <b-textarea v-model="story.story" spellcheck="true" rows="5" class="mb-1" placeholder="What have you given, what have you received, how does it feel, who have you met...?" />
            <h3>Add a photo</h3>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p>If you like, you can add a photo.  It's nice to see people and what they've freegled.  Take a selfie!</p>
            <b-btn variant="primary" size="lg" class="mt-1 mb-1" @click="photoAdd">
              <v-icon name="camera" /> Add a photo
            </b-btn>
          </b-col>
        </b-row>
        <b-row v-if="uploading">
          <b-col>
            <OurFilePond
              class="bg-white"
              imgtype="Story"
              imgflag="story"
              @photoProcessed="photoProcessed"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <div class="mt-2 float-left">
              <div v-if="story.photo" class="container p-0">
                <span @click="rotateLeft">
                  <v-icon label="Rotate left" class="topleft clickme" title="Rotate left">
                    <v-icon name="circle" scale="2" />
                    <v-icon
                      name="reply"
                      class="rotate__icon"
                    />
                  </v-icon>
                </span>
                <span @click="rotateRight">
                  <v-icon label="Rotate right" class="topright clickme" title="Rotate right" flip="horizontal">
                    <v-icon name="circle" scale="2" />
                    <v-icon
                      name="reply"
                      class="rotate__icon"
                    />
                  </v-icon>
                </span>
              </div>
              <b-img v-if="story.photo" thumbnail :src="story.photo.paththumb + '?' + cacheBust" />
              <b-img v-else thumbnail width="250" src="~/static/placeholder.jpg" />
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h3>Can we share?</h3>
            <p>Finally, click to let us know whether it's ok for us to share your story - on here, on social media and so on.  This helps get more people freegling.  We won't use your name or email address.</p>
            <p>If you don't want us to do this, that's fine - we'll just show it to your local volunteers.</p>
            <div class="bg-info text-center p-2">
              <b-form-radio-group v-model="allowpublic">
                <b-form-radio name="allowpublic" value="1">
                  Yes, you can share this
                </b-form-radio>
                <b-form-radio name="allowpublic" value="0">
                  No, keep it private
                </b-form-radio>
              </b-form-radio-group>
            </div>
          </b-col>
        </b-row>
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <div v-if="thankyou">
        <b-button variant="white" :disabled="uploadingPhoto" @click="cancel">
          Close
        </b-button>
      </div>
      <div v-else>
        <b-button variant="white" :disabled="uploadingPhoto" @click="cancel">
          Cancel
        </b-button>
        <b-button variant="success" :disabled="uploadingPhoto" @click="submit">
          Add Your Story
        </b-button>
      </div>
    </template>
  </b-modal>
</template>
<style scoped lang="scss">
@import 'color-vars';

.field {
  font-weight: bold;
  color: $color-green--darker;
}

label {
  font-weight: bold;
  color: $color-green--darker;
  margin-top: 10px;
}

.topleft {
  top: 12px;
  left: 10px;
  position: absolute;
}

.topright {
  top: 12px;
  right: 10px;
  position: absolute;
}

.container {
  position: relative;
}

.rotate__icon {
  color: $color-white;
}
</style>
<script>
const OurFilePond = () => import('~/components/OurFilePond')

export default {
  components: {
    OurFilePond
  },
  props: {},
  data: function() {
    return {
      showModal: false,
      allowpublic: 0,
      uploading: false,
      story: {
        headline: null,
        story: null,
        photo: null
      },
      cacheBust: Date.now(),
      thankyou: false
    }
  },
  computed: {
    uploadingPhoto() {
      return this.$store.getters['compose/getUploading']
    }
  },
  async mounted() {},
  methods: {
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // processed callback below.
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.story.photo = {
        id: imageid,
        path: image,
        paththumb: imagethumb
      }
    },

    rotate(deg) {
      this.$axios
        .post(process.env.API + '/image', {
          id: this.story.photo.id,
          rotate: deg,
          bust: Date.now(),
          story: true
        })
        .then(() => {
          this.cacheBust = Date.now()
        })
    },
    rotateLeft() {
      this.rotate(90)
    },
    rotateRight() {
      this.rotate(-90)
    },

    show(type) {
      this.thankyou = false
      this.story.headline = null
      this.story.story = null
      this.story.photo = null
      this.showModal = true
    },

    hide() {
      this.showModal = false
    },

    async submit() {
      if (this.story.headline && this.story.story) {
        await this.$store.dispatch('stories/add', {
          headline: this.story.headline,
          story: this.story.story,
          photo: this.story.photo ? this.story.photo.id : null,
          public: this.allowpublic
        })

        this.thankyou = true
      }
    }
  }
}
</script>
