<template>
  <b-modal
    id="profilemodal"
    v-model="showModal"
    size="lg"
    no-stacking
    @hidden="reset()"
  >
    <template slot="modal-header">
      <h4 v-if="added">
        Your opportunity has been added
      </h4>
      <h4 v-else-if="editing">
        <span v-if="volunteering.id">
          Edit Volunteer Opportunity
        </span>
        <span v-else>
          Add Volunteer Opportunity
        </span>
      </h4>
      <span v-else>
        <h4>{{ volunteering.title }}</h4>
        <a :href="volunteering.url" target="_blank" class="small">{{ volunteering.url }}</a>
      </span>
    </template>
    <template slot="default">
      <div v-if="added">
        <p>One of our volunteers will check over your opportunity, and then we'll publicise it to other freeglers.</p>
        <p>
          Hope you find someone!  Please make sure you get back to everyone who replies, so that they feel good about your organisation
          (and Freegle!).
        </p>
        <p>Freegle is free to use, but not free to run.  If you can, <b>please donate &pound;1</b> to keep us running - but anything you can give is very welcome.</p>
        <donation-button />
      </div>
      <div v-else>
        <div v-if="!editing">
          <div v-if="volunteering.photo">
            <notice-message class="mb-3">
              Scroll down past the picture for more information!
            </notice-message>
            <b-row>
              <b-col>
                <b-img lazy fluid :src="volunteering.photo.path" class="mb-2 w-100" />
              </b-col>
            </b-row>
          </div>
          <b-row>
            <b-col class="mb-2 prewrap">
              <b>{{ description }}</b>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col cols="4" md="3" class="field">
              Time commitment
            </b-col>
            <b-col cols="8" md="9">
              {{ volunteering.timecommitment }}
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" md="3" class="field">
              Where
            </b-col>
            <b-col cols="8" md="9">
              {{ volunteering.location }}
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" md="3" class="field">
              When
            </b-col>
            <b-col cols="8" md="9">
              <div v-for="date in volunteering.dates" :key="'volunteering-' + volunteering.id + '-' + (date.start ? date.start.toString() : '') + '-' + (date.end ? date.end.toString() : '')" :class="date && date.string && date.string.past ? 'inpast': ''">
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
          <b-row v-if="volunteering.contactname">
            <b-col cols="4" md="3" class="field">
              Contact name
            </b-col>
            <b-col cols="8" md="9">
              {{ volunteering.contactname }}
            </b-col>
          </b-row>
          <b-row v-if="volunteering.contactemail">
            <b-col cols="4" md="3" class="field">
              Contact email
            </b-col>
            <b-col cols="8" md="9">
              <a :href="'mailto:' + volunteering.contactemail">{{ volunteering.contactemail }}</a>
            </b-col>
          </b-row>
          <b-row v-if="volunteering.contacturl">
            <b-col cols="4" md="3" class="field">
              Website
            </b-col>
            <b-col cols="8" md="9" class="forcebreak">
              <a :href="volunteering.contacturl">{{ volunteering.contacturl }}</a>
            </b-col>
          </b-row>

          <br>
          <p v-if="volunteering.user" class="text-muted">
            Posted by {{ volunteering.user.displayname }} <span class="text-faded">(#{{ volunteering.user.id }})</span>
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
                <groupRememberSelect v-model="groupid" remember="editopportunity" :systemwide="true" />
                <b-form-invalid-feedback>
                  Please select a community
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                v-if="enabled"
                ref="volunteeringEdit__title"
                label="What's the opportunity?"
                label-for="title"
                :state="validationEnabled ? !$v.volunteeringEdit.title.$invalid : null"
              >
                <validating-form-input
                  id="title"
                  v-model="volunteeringEdit.title"
                  type="text"
                  placeholder="Give the opportunity a short title"
                  :validation="$v.volunteeringEdit.title"
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
                <div v-if="volunteering.photo" class="container p-0">
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
                <b-img v-if="volunteeringEdit.photo" thumbnail :src="volunteeringEdit.photo.paththumb + '?' + cacheBust" />
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
                  imgtype="Volunteering"
                  imgflag="volunteering"
                  :ocr="true"
                  @photoProcessed="photoProcessed"
                />
              </b-col>
            </b-row>

            <b-form-group
              ref="volunteeringEdit__description"
              label="What is it?"
              label-for="description"
              :state="validationEnabled ? !$v.volunteeringEdit.description.$invalid : null"
            >
              <validating-textarea
                id="description"
                v-model="volunteeringEdit.description"
                rows="5"
                max-rows="8"
                spellcheck="true"
                placeholder="Please let people know what the opportunity is - any organisation which is involved, what you'd like them to do, and why they might like to do it."
                class="mt-2"
                :validation="$v.volunteeringEdit.description"
                :validation-enabled="validationEnabled"
                :validation-messages="{
                  required: 'Please add a description'
                }"
              />
            </b-form-group>
            <b-form-group
              ref="volunteeringEdit__timecommitment"
              label="Time commitment:"
              label-for="description"
              :state="validationEnabled ? !$v.volunteeringEdit.timecommitment.$invalid : null"
            >
              <validating-textarea
                id="timecommitment"
                v-model="volunteeringEdit.timecommitment"
                rows="2"
                max-rows="8"
                spellcheck="true"
                placeholder="Please let people know what the time commitment is that you're looking for, e.g. how many hours a week, what times of day."
                class="mt-2"
                :validation="$v.volunteeringEdit.timecommitment"
                :validation-enabled="validationEnabled"
                :validation-messages="{
                  required: 'Please add the time commitment'
                }"
              />
            </b-form-group>
            <b-form-group
              ref="volunteeringEdit__location"
              label="Where is it?"
              label-for="location"
              :state="validationEnabled ? !$v.volunteeringEdit.location.$invalid : null"
            >
              <validating-form-input
                id="location"
                v-model="volunteeringEdit.location"
                type="text"
                placeholder="Where does the volunteering happen? Add a postcode to make sure people can find you!"
                :validation="$v.volunteeringEdit.location"
                :validation-enabled="validationEnabled"
                :validation-messages="{
                  required: 'Please add a location'
                }"
              />
            </b-form-group>
            <b-form-group label="When is it?">
              <p>You can add multiple dates if the opportunity occurs several times.</p>
              <StartEndCollection v-if="volunteeringEdit.dates" v-model="volunteeringEdit.dates" />
            </b-form-group>
            <b-form-group
              ref="volunteeringEdit__contactname"
              label="Contact name:"
              label-for="contactname"
              :state="volunteeringEdit.contactname && validationEnabled ? !$v.volunteeringEdit.contactname.$invalid : null"
            >
              <validating-form-input
                id="contactname"
                v-model="volunteeringEdit.contactname"
                type="text"
                placeholder="Is there a contact person for anyone who wants to find out more? (Optional)"
                :validation="$v.volunteeringEdit.contactname"
                :validation-enabled="volunteeringEdit.contactname && validationEnabled"
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
                v-model="volunteeringEdit.contactemail"
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
                v-model="volunteeringEdit.contactphone"
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
                v-model="volunteeringEdit.contacturl"
                type="url"
                placeholder="Is there more information on the web? (Optional)"
              />
            </b-form-group>
          </span>
          <NoticeMessage v-else variant="warning" class="mt-2">
            <v-icon name="info-circle" />&nbsp;This community has chosen not to allow Volunteer Opportunities.
          </NoticeMessage>
        </validating-form>
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <div v-if="added">
        <b-button variant="white" class="float-right" :disabled="uploadingPhoto" @click="cancel">
          Close
        </b-button>
      </div>
      <div v-else>
        <div v-if="volunteering.canmodify" class="w-100">
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
          <span v-if="volunteering.id">Save Changes</span>
          <span v-else>Add Opportunity</span>
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { validationMixin } from 'vuelidate'
import { maxLength, required } from 'vuelidate/lib/validators'
import twem from '~/assets/js/twem'
import ValidatingForm from '@/components/ValidatingForm'
import ValidatingFormInput from '@/components/ValidatingFormInput'
import ValidatingTextarea from '@/components/ValidatingTextarea'
import validationHelpers from '@/mixins/validationHelpers'

const GroupRememberSelect = () => import('~/components/GroupRememberSelect')
const OurFilePond = () => import('~/components/OurFilePond')
const StartEndCollection = () => import('~/components/StartEndCollection')
const NoticeMessage = () => import('~/components/NoticeMessage')
const DonationButton = () => import('~/components/DonationButton')

function initialVolunteering() {
  return {
    id: null,
    title: null,
    description: null,
    photo: null,
    user: null,
    url: null,
    timecommitment: null,
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
    volunteeringEdit: cloneDeep(this.volunteering),
    showModal: false,
    editing: false,
    added: false,
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
    NoticeMessage,
    DonationButton
  },
  mixins: [validationMixin, validationHelpers],
  props: {
    volunteering: {
      type: Object,
      default: initialVolunteering
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
      return Boolean(this.volunteering.id)
    },
    description() {
      let desc = this.volunteering.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    },
    enabled() {
      const group = this.$store.getters['auth/groupById'](this.groupid)

      let ret = true

      if (group) {
        if ('volunteering' in group.settings) {
          ret = group.settings.volunteering
        }
      }

      return ret
    },
    shouldUpdatePhoto() {
      const { photo: oldPhoto } = this.volunteering
      const { photo: newPhoto } = this.volunteeringEdit
      return newPhoto && (oldPhoto ? newPhoto.id !== oldPhoto.id : true)
    }
  },
  methods: {
    show() {
      this.editing = this.startEdit
      this.showModal = true
      if (this.volunteering.groups && this.volunteering.groups.length > 0) {
        this.groupid = this.volunteering.groups[0].id
      }
    },
    hide() {
      this.editing = false
      this.uploading = false
      this.showModal = false
      this.saving = false
    },
    async deleteIt() {
      await this.$store.dispatch('volunteerops/delete', {
        id: this.volunteering.id
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
        const { id } = this.volunteering
        // This is an edit.
        if (this.shouldUpdatePhoto) {
          await this.$store.dispatch('volunteerops/setPhoto', {
            id,
            photoid: this.volunteeringEdit.photo.id
          })
        }

        const oldgroupid = this.volunteering.groups
          ? this.volunteering.groups[0].id
          : null

        if (this.groupid !== oldgroupid) {
          // Save the new group, then remove the old group, so it won't get stranded.
          //
          // Checking for groupid > 0 allows systemwide opportunities.
          if (this.groupid > 0) {
            await this.$store.dispatch('volunteerops/addGroup', {
              id,
              groupid: this.groupid
            })
          }

          if (oldgroupid) {
            await this.$store.dispatch('volunteerops/removeGroup', {
              id,
              groupid: oldgroupid
            })
          }
        }

        await this.$store.dispatch('volunteerops/setDates', {
          id,
          olddates: this.volunteering.dates,
          newdates: this.volunteeringEdit.dates
        })

        await this.$store.dispatch('volunteerops/save', this.volunteeringEdit)

        this.added = true
      } else {
        // This is an add.  First create it to get the id.
        const dates = this.volunteeringEdit.dates
        const photoid = this.volunteeringEdit.photo
          ? this.volunteeringEdit.photo.id
          : null

        const id = await this.$store.dispatch(
          'volunteerops/add',
          this.volunteeringEdit
        )

        if (id) {
          if (photoid) {
            await this.$store.dispatch('volunteerops/setPhoto', {
              id,
              photoid: photoid
            })
          }

          // Save the group.
          await this.$store.dispatch('volunteerops/addGroup', {
            id,
            groupid: this.groupid
          })

          if (dates && dates.length) {
            await this.$store.dispatch('volunteerops/setDates', {
              id,
              olddates: [],
              newdates: dates
            })
          }

          // Fetch for good luck.
          await this.$store.dispatch('volunteerops/fetch', {
            id
          })

          this.added = true
        }
      }

      this.hide()
    },
    async dontSave() {
      // We may have updated the opportunity during the edit.  Fetch it again to reset those changes.
      await this.$store.dispatch('volunteerops/fetch', {
        id: this.volunteering.id
      })

      this.hide()
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // processed callback below.
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.volunteeringEdit.photo = {
        id: imageid,
        path: image,
        paththumb: imagethumb
      }

      // We don't do OCR on these - volunteer op photos are much less likely to have useful text than community
      // events.
    },
    rotate(deg) {
      this.$axios
        .post(process.env.API + '/image', {
          id: this.volunteeringEdit.photo.id,
          rotate: deg,
          bust: Date.now(),
          volunteering: true
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
    volunteeringEdit: {
      title: {
        required,
        maxLength: maxLength(80)
      },
      description: {
        required
      },
      timecommitment: {
        required
      },
      location: {
        required
      },
      contactname: {
        maxLength: maxLength(60)
      }
    }
  }
}
</script>

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

.modal-footer > div {
  width: 100%;
}
</style>
