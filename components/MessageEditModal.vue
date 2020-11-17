<template>
  <div>
    <client-only>
      <b-modal
        id="aboutmemodal"
        v-model="showModal"
        size="lg"
        title-class="w-100"
      >
        <template slot="modal-title">
          <div class="d-flex flex-wrap justify-content-between w-100">
            <em>{{ message.subject }}</em>
            <NumberIncrementDecrement
              v-if="message.type === 'Offer'"
              :count.sync="message.availablenow"
              label="Quantity"
              append-text=" available"
              class="count pt-1"
              size="md"
            />
          </div>
        </template>
        <template slot="default">
          <div v-if="message.location">
            <b-row>
              <b-col cols="6" md="3">
                <b-form-select v-model="type" :options="typeOptions" size="lg" />
              </b-col>
              <b-col cols="6">
                <PostItem ref="item" v-model="item" />
              </b-col>
              <b-col cols="6" md="3">
                <Postcode :find="false" size="md" @selected="postcodeSelect" @cleared="postcodeClear" />
              </b-col>
            </b-row>
          </div>
          <div v-else>
            <b-row>
              <b-col>
                <b-form-input v-model="message.subject" />
              </b-col>
            </b-row>
          </div>
          <b-row>
            <b-col>
              <b-form-textarea
                ref="textbody"
                v-model="message.textbody"
                :placeholder="placeholder"
                rows="8"
                class="mt-2"
              />
            </b-col>
          </b-row>
          <b-row v-if="uploading" class="bg-white">
            <b-col class="p-0">
              <OurFilePond
                imgtype="Message"
                imgflag="message"
                @photoProcessed="photoProcessed"
              />
            </b-col>
          </b-row>
          <b-row v-if="attachments && attachments.length">
            <b-col>
              <b-list-group horizontal class="mb-1 mt-2">
                <b-list-group-item v-for="att in attachments" :key="'image-' + att.id" class="bg-transparent p-0">
                  <PostPhoto v-bind="att" @remove="removePhoto" />
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-btn variant="secondary" class="mr-auto" @click="photoAdd">
            <v-icon name="camera" />&nbsp;Add photo
          </b-btn>
          <b-button variant="white" :disabled="uploadingPhoto" @click="cancel">
            Cancel
          </b-button>
          <b-button variant="primary" :disabled="saving || uploadingPhoto" @click="save">
            <v-icon v-if="saving" name="sync" class="fa-spin" />
            <v-icon v-else name="save" />
            Save
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import NumberIncrementDecrement from './NumberIncrementDecrement'
import keywords from '@/mixins/keywords.js'
const OurFilePond = () => import('~/components/OurFilePond')
const Postcode = () => import('./Postcode')
const PostItem = () => import('./PostItem')
const PostPhoto = () => import('./PostPhoto')

export default {
  components: {
    NumberIncrementDecrement,
    OurFilePond,
    Postcode,
    PostItem,
    PostPhoto
  },
  mixins: [keywords],
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      attachments: null,
      showModal: false,
      uploading: false,
      myFiles: [],
      image: null,
      type: null,
      item: null,
      postcode: null,
      saving: null
    }
  },
  computed: {
    uploadingPhoto() {
      return this.$store.getters['compose/getUploading']
    },
    placeholder() {
      return this.message && this.type === 'Offer'
        ? "Please give a few details, e.g. colour, condition, size, whether it's working etc."
        : "Please give a few more details about what you're looking for, and why you'd like it."
    }
  },
  mounted() {
    this.attachments = this.message.attachments
    this.type = this.message.type
    this.item = this.message.item ? this.message.item.name : null
    this.postcode = this.message.location ? this.message.location : null
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async save() {
      if (this.item && (this.message.textbody || this.attachments.length)) {
        const attids = []
        this.saving = true

        for (const att of this.attachments) {
          attids.push(att.id)
        }

        await this.$store.dispatch('messages/patch', {
          id: this.message.id,
          msgtype: this.type,
          item: this.item,
          location: this.postcode.name,
          textbody: this.message.textbody,
          attachments: attids,
          availablenow: this.message.availablenow
        })

        this.saving = null
        this.hide()
      }
    },
    removePhoto(id) {
      this.attachments = this.attachments.filter(item => {
        return item.id !== id
      })
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.attachments.push({
        id: imageid,
        paththumb: imagethumb,
        path: image
      })
    },
    postcodeSelect(pc) {
      this.postcode = pc
    },
    postcodeClear() {
      this.postcode = null
    }
  }
}
</script>
