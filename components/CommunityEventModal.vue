<template>
  <b-modal
    :id="'eventmodal-' + event.id"
    v-model="showModal"
    size="lg"
    no-stacking
    @hidden="reset()"
  >
    <template slot="modal-header">
      <h4 v-if="editing">
        <span v-if="isExisting">
          Edit Event
        </span>
        <span v-else>
          Add Event
        </span>
      </h4>
      <span v-else>
        <h4>{{ event.title }}</h4>
        <a :href="event.url" target="_blank" class="small">{{ event.url }}</a>
      </span>
    </template>
    <template slot="default">
      <div v-if="!editing">
        <div v-if="event.photo">
          <notice-message class="mb-3">
            Scroll down past the picture for more information!
          </notice-message>
          <b-row>
            <b-col>
              <b-img lazy fluid :src="event.photo.path" class="mb-2 w-100" />
            </b-col>
          </b-row>
        </div>
        <b-row>
          <b-col class="mb-2 prewrap">
            <b>{{ description }}</b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="4" md="3" class="field">
            Where
          </b-col>
          <b-col cols="8" md="9">
            {{ event.location }}
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="4" md="3" class="field">
            When
          </b-col>
          <b-col cols="8" md="9">
            <div v-for="date in event.dates" :key="'event-' + event.id + '-' + date.uniqueid" :class="date && date.string && date.string.past ? 'inpast': ''">
              <span v-if="date && date.string">
                <span v-if="date.string.start">
                  {{ date.string.start }}
                </span>
                <span v-if="date.string.start && date.string.end">
                  -
                </span>
                <span v-if="date.string.end">
                  {{ date.string.end }}
                </span>
                <br>
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row v-if="event.contactname">
          <b-col cols="4" md="3" class="field">
            Contact name
          </b-col>
          <b-col cols="8" md="9">
            {{ event.contactname }}
          </b-col>
        </b-row>
        <b-row v-if="event.contactemail">
          <b-col cols="4" md="3" class="field">
            Contact email
          </b-col>
          <b-col cols="8" md="9">
            <a :href="'mailto:' + event.contactemail">{{ event.contactemail }}</a>
          </b-col>
        </b-row>
        <b-row v-if="event.contacturl">
          <b-col cols="4" md="3" class="field">
            Website
          </b-col>
          <b-col cols="8" md="9" class="forcebreak">
            <a :href="event.contacturl">{{ event.contacturl }}</a>
          </b-col>
        </b-row>

        <br>
        <p v-if="event.user" class="text-muted">
          Posted by {{ event.user.displayname }} <span class="text-faded">(#{{ event.user.id }})</span>
        </p>
      </div>
      <validating-form v-else>
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group
              ref="groupid"
              label="For which community?"
              :state="validationEnabled ? !$v.groupid.$invalid : null"
            >
              <groupRememberSelect v-model="groupid" remember="editevent" />
              <b-form-invalid-feedback>
                Please select a community
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              v-if="enabled"
              ref="eventEdit__title"
              label="What's the event's name?"
              label-for="title"
              :state="validationEnabled ? !$v.eventEdit.title.$invalid : null"
            >
              <validating-form-input
                id="title"
                v-model="eventEdit.title"
                type="text"
                placeholder="Give the event a short title"
                :validation="$v.eventEdit.title"
                :validation-enabled="validationEnabled"
                :validation-messages="{
                  required: 'Please add a title',
                  maxLength: ({ max }) => `Max length is ${max}`
                }"
              />
            </b-form-group>
          </b-col>
          <b-col v-if="enabled" cols="12" md="6">
            <div class="float-right">
              <div v-if="eventEdit.photo" class="container p-0">
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
              <b-img v-if="eventEdit.photo" thumbnail :src="eventEdit.photo.paththumb + '?' + cacheBust" />
              <b-img v-else width="250" thumbnail src="~/static/placeholder.jpg" />
            </div>
          </b-col>
        </b-row>
        <span v-if="enabled">
          <b-row>
            <b-col>
              <b-btn variant="white" class="mt-1 float-right" @click="photoAdd">
                <v-icon name="camera" /> Upload photo
              </b-btn>
            </b-col>
          </b-row>
          <b-row v-if="uploading">
            <b-col>
              <OurFilePond
                class="bg-white"
                imgtype="CommunityEvent"
                imgflag="communityevent"
                :ocr="true"
                @photoProcessed="photoProcessed"
              />
            </b-col>
          </b-row>
          <b-form-group
            ref="eventEdit__description"
            label="What is it?"
            label-for="description"
            :state="validationEnabled ? !$v.eventEdit.description.$invalid : null"
          >
            <validating-textarea
              id="description"
              v-model="eventEdit.description"
              rows="5"
              max-rows="8"
              spellcheck="true"
              placeholder="Let people know what the event is - why they should come, what to expect, and any admission charge or fee (we only approve free or cheap events)."
              class="mt-2"
              :validation="$v.eventEdit.description"
              :validation-enabled="validationEnabled"
              :validation-messages="{
                required: 'Please add a description'
              }"
            />
          </b-form-group>
          <b-form-group
            ref="eventEdit__location"
            label="Where is it?"
            label-for="location"
            :state="validationEnabled ? !$v.eventEdit.location.$invalid : null"
          >
            <validating-form-input
              id="location"
              v-model="eventEdit.location"
              type="text"
              placeholder="Where is it being held? Add a postcode to make sure people can find you!"
              :validation="$v.eventEdit.location"
              :validation-enabled="validationEnabled"
              :validation-messages="{
                required: 'Please add a location'
              }"
            />
          </b-form-group>
          <b-form-group
            ref="eventEdit__dates"
            label="When is it?"
            :state="validationEnabled ? !$v.eventEdit.dates.$invalid : null"
          >
            <p>You can add multiple dates if the event occurs several times.</p>
            <b-form-invalid-feedback class="mb-3">
              Please add at least one date
            </b-form-invalid-feedback>
            <StartEndCollection v-if="eventEdit.dates" v-model="eventEdit.dates" required />
          </b-form-group>
          <b-form-group
            ref="eventEdit__contactname"
            label="Contact name:"
            label-for="contactname"
            :state="eventEdit.contactname && validationEnabled ? !$v.eventEdit.contactname.$invalid : null"
          >
            <validating-form-input
              id="contactname"
              v-model="eventEdit.contactname"
              type="text"
              placeholder="Is there a contact person for anyone who wants to find out more? (Optional)"
              :validation="$v.eventEdit.contactname"
              :validation-enabled="eventEdit.contactname && validationEnabled"
              :validation-messages="{
                maxLength: ({ max }) => `Max length is ${max}`
              }"
            />
          </b-form-group>
          <b-form-group
            label="Contact email:"
            label-for="contactemail"
          >
            <b-form-input
              id="contactemail"
              v-model="eventEdit.contactemail"
              type="email"
              placeholder="Can people reach you by email? (Optional)"
            />
          </b-form-group>
          <b-form-group
            label="Contact phone:"
            label-for="contactphone"
          >
            <b-form-input
              id="contactphone"
              v-model="eventEdit.contactphone"
              type="tel"
              placeholder="Can people reach you by phone? (Optional)"
            />
          </b-form-group>
          <b-form-group
            label="Web link:"
            label-for="contacturl"
          >
            <b-form-input
              id="contacturl"
              v-model="eventEdit.contacturl"
              type="tel"
              placeholder="Is there more information on the web? (Optional)"
            />
          </b-form-group>
        </span>
        <NoticeMessage v-else variant="warning" class="mt-2">
          <v-icon name="info-circle" />&nbsp;This community has chosen not to allow Community Events.
        </NoticeMessage>
      </validating-form>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <div v-if="event.canmodify" class="w-100">
        <b-button v-if="!editing" variant="white" class="float-left" :disabled="uploadingPhoto" @click="editing = true">
          <v-icon name="pen" />
          Edit
        </b-button>
        <b-button variant="white" class="float-left ml-1" :disabled="uploadingPhoto" @click="deleteIt">
          <v-icon name="trash-alt" />
          Delete
        </b-button>
      </div>
      <b-button v-if="!editing" variant="white" class="float-right" :disabled="uploadingPhoto" @click="cancel">
        Close
      </b-button>
      <b-button v-if="editing" variant="white" class="float-right" :disabled="uploadingPhoto" @click="dontSave">
        Cancel
      </b-button>
      <b-button v-if="editing" variant="success" class="float-right" :disabled="uploadingPhoto" @click="saveIt">
        <v-icon v-if="saving" name="sync" class="fa-spin" />
        <v-icon v-else name="save" />
        <span v-if="isExisting">Save Changes</span>
        <span v-else>Add Event</span>
      </b-button>
    </template>
  </b-modal>
</template>

<style scoped lang="scss">
@import 'color-vars';

.field {
  font-weight: bold;
  color: $color-green--darker;
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
// TODO DESIGN This layout is staid table nonsense.  Surely we can make it more appealing?
// TODO MINOR Wherever we have b-img (throughout the site, not just here) we should have @brokenImage.  Bet we don't.
// TODO NS Set date to start at 9am rather than midnight.  Default end date to later than start date.
import { required, maxLength } from 'vuelidate/lib/validators'
import cloneDeep from 'lodash.clonedeep'
import { validationMixin } from 'vuelidate'
import validationHelpers from '@/mixins/validationHelpers'
import twem from '~/assets/js/twem'
import ValidatingForm from '@/components/ValidatingForm'
import ValidatingFormInput from '@/components/ValidatingFormInput'
import ValidatingTextarea from '@/components/ValidatingTextarea'

const GroupRememberSelect = () => import('~/components/GroupRememberSelect')
const OurFilePond = () => import('~/components/OurFilePond')
const StartEndCollection = () => import('~/components/StartEndCollection')
const NoticeMessage = () => import('~/components/NoticeMessage')

function initialEvent() {
  return {
    id: null,
    title: null,
    photo: null,
    description: null,
    location: null,
    dates: [],
    groups: [],
    contactname: null,
    contactemail: null,
    contactphone: null,
    contacturl: null,
    canmodify: null
  }
}

function initialData() {
  return {
    eventEdit: cloneDeep(this.event),
    showModal: false,
    editing: false,
    groupid: null,
    uploading: false,
    cacheBust: Date.now(),
    saving: false
  }
}

export default {
  components: {
    ValidatingForm,
    ValidatingFormInput,
    ValidatingTextarea,
    GroupRememberSelect,
    OurFilePond,
    StartEndCollection,
    NoticeMessage
  },
  mixins: [validationMixin, validationHelpers],
  props: {
    event: {
      type: Object,
      default: initialEvent
    },
    startEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: initialData,
  computed: {
    uploadingPhoto() {
      return this.$store.getters['compose/getUploading']
    },
    isExisting() {
      return Boolean(this.event.id)
    },
    description() {
      let desc = this.eventEdit.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    },
    enabled() {
      const group = this.$store.getters['auth/groupById'](this.groupid)

      let ret = true

      if (group) {
        if ('communityevents' in group.settings) {
          ret = group.settings.communityevents
        }
      }

      return ret
    },
    shouldUpdatePhoto() {
      const { photo: oldPhoto } = this.event
      const { photo: newPhoto } = this.eventEdit
      return newPhoto && (oldPhoto ? newPhoto.id !== oldPhoto.id : true)
    }
  },
  methods: {
    show() {
      this.editing = this.startEdit
      this.showModal = true
      if (this.eventEdit.groups && this.eventEdit.groups.length > 0) {
        this.groupid = this.eventEdit.groups[0].id
      }
    },
    hide() {
      this.showModal = false
    },
    async deleteIt() {
      await this.$store.dispatch('communityevents/delete', {
        id: this.event.id
      })

      this.hide()
    },
    reset() {
      Object.assign(this, initialData.call(this))
      this.$v.$reset()
    },
    async saveIt() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        this.validationFocusFirstError()
        return
      }

      this.saving = true

      if (this.isExisting) {
        const { id } = this.event
        // This is an edit.
        if (this.shouldUpdatePhoto) {
          await this.$store.dispatch('communityevents/setPhoto', {
            id,
            photoid: this.eventEdit.photo.id
          })
        }

        const oldgroupid =
          this.event.groups.length > 0 ? this.event.groups[0].id : null

        if (this.groupid !== oldgroupid) {
          // Save the new group, then remove the old group, so it won't get stranded.
          await this.$store.dispatch('communityevents/addGroup', {
            id,
            groupid: this.groupid
          })

          if (oldgroupid) {
            await this.$store.dispatch('communityevents/removeGroup', {
              id,
              groupid: oldgroupid
            })
          }
        }

        await this.$store.dispatch('communityevents/setDates', {
          id,
          olddates: this.event.dates,
          newdates: this.eventEdit.dates
        })

        await this.$store.dispatch('communityevents/save', this.eventEdit)
      } else {
        // This is an add.  First create it to get the id.
        const dates = this.eventEdit.dates
        const photoid = this.eventEdit.photo ? this.eventEdit.photo.id : null

        const id = await this.$store.dispatch(
          'communityevents/add',
          this.eventEdit
        )

        if (photoid) {
          await this.$store.dispatch('communityevents/setPhoto', {
            id,
            photoid: photoid
          })
        }

        // Save the group.
        await this.$store.dispatch('communityevents/addGroup', {
          id,
          groupid: this.groupid
        })

        await this.$store.dispatch('communityevents/setDates', {
          id,
          olddates: [],
          newdates: dates
        })

        // Fetch for good luck.
        await this.$store.dispatch('communityevents/fetch', {
          id
        })
      }

      this.hide()
    },
    async dontSave() {
      // We may have updated the event during the edit.  Fetch it again to reset those changes.
      await this.$store.dispatch('communityevents/fetch', {
        id: this.event.id
      })

      this.hide()
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // processed callback below.
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb, image, ocr) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.eventEdit.photo = {
        id: imageid,
        path: image,
        paththumb: imagethumb
      }

      if (ocr) {
        // We might have some OCR text from a poster which we can add in.
        const p = ocr.indexOf('\n')
        const title = p !== -1 ? ocr.substring(0, p) : null
        const desc = p !== -1 ? ocr.substring(p + 1) : ocr

        if (!this.eventEdit.title) {
          this.eventEdit.title = title
        }

        if (!this.eventEdit.description) {
          this.eventEdit.description = desc
        }
      }
    },
    rotate(deg) {
      this.$axios
        .post(process.env.API + '/image', {
          id: this.eventEdit.photo.id,
          rotate: deg,
          bust: Date.now(),
          communityevent: true
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
    }
  },
  validations: {
    groupid: {
      required
    },
    eventEdit: {
      title: {
        required,
        maxLength: maxLength(80)
      },
      description: {
        required
      },
      location: {
        required
      },
      dates: {
        minLength: dates =>
          dates.filter(({ start, end }) => start && end).length > 0
      },
      contactname: {
        maxLength: maxLength(60)
      }
    }
  }
}
</script>
