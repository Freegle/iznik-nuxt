<template>
  <div>
    <client-only>
      <b-modal
        id="aboutmemodal"
        v-model="showModal"
        size="lg"
        no-stacking
      >
        <template slot="modal-title">
          Edit <em>{{ message.subject }}</em>
        </template>
        <template slot="default">
          <div v-if="item">
            <b-row>
              <b-col cols="6" md="3">
                <b-form-select v-model="message.type">
                  <option value="Offer">
                    OFFER
                  </option>
                  <option value="Wanted">
                    WANTED
                  </option>
                </b-form-select>
              </b-col>
              <b-col cols="6">
                <PostItem :item="item" @selected="itemSelect" @typed="itemType" />
              </b-col>
              <b-col cols="6" md="3">
                <Postcode :focus="false" :find="false" size="md" @selected="postcodeSelect" @cleared="postcodeClear" />
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
                <b-list-group-item v-for="(att, $index) in attachments" :key="'image-' + $index" class="bg-transparent p-0">
                  <PostPhoto v-bind="att" @remove="removePhoto" />
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-btn variant="primary" class="mr-auto" @click="photoAdd">
            <v-icon name="camera" />&nbsp;Add photo
          </b-btn>
          <b-button variant="white" @click="cancel">
            Cancel
          </b-button>
          <b-button variant="success" :disabled="saving" @click="save">
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
const OurFilePond = () => import('~/components/OurFilePond')
const Postcode = () => import('./Postcode')
const PostItem = () => import('./PostItem')
const PostPhoto = () => import('./PostPhoto')

export default {
  components: {
    OurFilePond,
    Postcode,
    PostItem,
    PostPhoto
  },
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
      item: null,
      postcode: null,
      saving: null
    }
  },
  computed: {
    placeholder() {
      return this.message && this.message.type === 'Offer'
        ? 'Please give a few details if possible, e.g. colour, condition, size etc.'
        : "Please give a few more details about what you're looking for, and why you'd like it."
    }
  },
  mounted() {
    this.attachments = this.message.attachments
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
      const attids = []
      this.saving = true

      for (const att of this.attachments) {
        attids.push(att.id)
      }

      await this.$store.dispatch('messages/patch', {
        id: this.message.id,
        msgtype: this.message.type,
        item: this.item,
        location: this.postcode.name,
        textbody: this.$refs.textbody.value,
        attachments: attids
      })

      this.saving = null
      this.hide()
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
    itemType(value) {
      this.item = value
    },
    itemSelect(item) {
      this.item = item.name
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
