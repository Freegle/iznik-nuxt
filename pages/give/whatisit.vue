<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <b-row class="bs-wizard">
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              Where are you?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum active">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot active" />
            <div class="bs-wizard-info text-center">
              What is it?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              Who are you?
            </div>
          </b-col>
        </b-row>

        <h1 class="text-center">
          Ok, now tell us about your item
        </h1>
        <b-row>
          <b-col cols="auto" class="mt-2 pl-0">
            <b-btn variant="success" size="lg" @click="photoAdd">
              <fa icon="camera" />&nbsp;Add photos
            </b-btn>
          </b-col>
          <b-col class="text-center mt-2">
            <b-alert variant="info" class="d-none d-md-inline-block float-right" show>
              <fa icon="info-circle" />&nbsp;Please add photos - you'll get a better response.
            </b-alert>
          </b-col>
        </b-row>
        <b-row v-if="uploading" class="bg-white">
          <b-col class="p-0">
            <file-pond
              ref="pond"
              name="photo"
              allow-multiple="false"
              accepted-file-types="image/jpeg, image/png, image/gif, image/jpg"
              :files="myFiles"
              image-resize-target-width="800"
              image-resize-target-height="800"
              image-crop-aspect-ratio="1"
              label-idle="Drag & Drop photos or <span class=&quot;btn btn-white ction&quot;> Browse </span>"
              :server="{ process, revert, restore, load, fetch }"
              @init="photoInit"
              @processfile="photoProcessed"
            />
          </b-col>
        </b-row>
        <b-row v-if="attachments && attachments.length">
          <b-col class="p-0">
            <b-list-group horizontal class="mb-1">
              <b-list-group-item v-for="(att, $index) in attachments" :key="'image-' + $index" class="bg-transparent p-0">
                <PostPhoto v-bind="att" @remove="removePhoto" />
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="pl-0">
            <PostItem :key="item" :item="item" @selected="itemSelect" @cleared="itemClear" @typed="itemType" />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="pl-0 pt-1">
            <b-form-textarea
              v-model="description"
              placeholder="Please give a few details if possible, e.g. colour, condition, size etc."
              rows="6"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-muted small pl-0 pt-1">
            We may show this post, but not your email address, to people who are not yet members of Freegle.
            This helps the community grow by showing people what's happening and encouraging them to join.
          </b-col>
        </b-row>
        <b-row v-if="item && (description || attachments.length)" :key="busted">
          <b-col cols="12" md="6" offset-md="3" class="text-center pt-2">
            <b-btn variant="success" size="lg" block @click="next">
              Next >>
            </b-btn>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>
<script>
// TODO Add speech recognition
// TODO Image recognition
// TODO Suppose we end up here, without a postcode in the store?
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import PostPhoto from '~/components/PostPhoto'
import PostItem from '~/components/PostItem'

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)

// TODO Add speech recognition
export default {
  components: {
    FilePond,
    PostPhoto,
    PostItem
  },
  data() {
    return {
      id: null,
      valid: false,
      uploading: false,
      myFiles: [],
      image: null,
      busted: new Date().getTime() // TODO We're having trouble with the logic to get the next button to show.
    }
  },
  computed: {
    item: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage']()
        console.log('Compute item', msg)
        return msg && msg.item ? msg.item : ''
      },
      set: function(newValue) {
        console.log('Set item', newValue)
        this.$store.dispatch('compose/setItem', newValue)
        this.busted = new Date().getTime()
      }
    },
    description: {
      get: function() {
        const msg = this.$store.getters['compose/getMessage']()
        return msg ? msg.description : null
      },
      set: function(newValue) {
        this.$store.dispatch('compose/setDescription', newValue)
        this.busted = new Date().getTime()
      }
    },
    attachments() {
      return this.$store.getters['compose/getAttachments']()
    }
  },
  methods: {
    save() {
      this.$store.dispatch('compose/setMessage', {
        item: this.item,
        description: this.description,
        type: 'Offer'
      })
    },
    async next() {
      await this.save()
      this.$router.push('/give/whoami')
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      this.uploading = true
    },
    photoInit: function() {
      // We have rendered the filepond instance.  Trigger browse so that they can upload a photo without an
      // extra click.
      this.$refs.pond.browse()
    },
    photoProcessed(error, file) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.$store.dispatch('compose/addAttachment', this.image)
      this.busted = new Date().getTime()

      // The imageid is in this.imageid.  Store it.
      if (error) {
        // TODO
      }
    },
    async process(fieldName, file, metadata, load, error, progress, abort) {
      const data = new FormData()
      data.append('photo', file, 'photo')
      data.append('message', true)
      data.append('imgtype', 'Message')

      const ret = await this.$axios.post(process.env.API + '/image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUpLoadProgress: e => {
          progress(e.lengthComputable, e.loaded, e.total)
        }
      })

      if (ret.status === 200 && ret.data.ret === 0) {
        this.image = {
          id: ret.data.id,
          paththumb: ret.data.paththumb,
          path: ret.data.path
        }

        load(ret.data.id)
      } else {
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
    removePhoto(id) {
      this.$store.dispatch('compose/removeAttachment', id)
    },
    itemType(value) {
      this.item = value
      this.$store.dispatch('compose/setItem', this.item)
      this.busted = new Date().getTime()
    },
    itemSelect(item) {
      this.item = item.name
      this.$store.dispatch('compose/setItem', this.item)
      this.busted = new Date().getTime()
    },
    itemClear() {
      this.item = null
      this.busted = new Date().getTime()
    }
  }
}
</script>
