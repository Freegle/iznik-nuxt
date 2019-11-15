<template>
  <b-modal
    id="profilemodal"
    v-model="showModal"
    size="lg"
    no-stacking
  >
    <template slot="modal-header">
      <h4 v-if="editing">
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
      <div v-if="!editing">
        <div v-if="volunteering.photo">
          <b-alert show variant="info">
            Scroll down past the picture for more information!
          </b-alert>
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
      <div v-else>
        <b-row>
          <b-col cols="12" md="6">
            <label for="group">
              For which community?
            </label>
            <groupRememberSelect v-model="groupid" remember="editopportunity" />
            <label for="title">
              What's the opportunity?
            </label>
            <b-form-input id="title" v-model="volunteering.title" type="text" maxlength="80" placeholder="Give the opportunity a short title" />
          </b-col>
          <b-col cols="12" md="6">
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
              <b-img v-if="volunteering.photo" thumbnail :src="volunteering.photo.paththumb + '?' + cacheBust" />
              <b-img v-else width="250" thumbnail src="~/static/placeholder.jpg" />
            </div>
          </b-col>
        </b-row>
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
        <label for="description">
          What is it?
        </label>
        <b-textarea
          id="description"
          v-model="volunteering.description"
          rows="5"
          max-rows="8"
          spellcheck="true"
          placeholder="Please let people know what the opportunity is - any organisation which is involved, what you'd like them to do, and why they might like to do it."
          class="mt-2"
        />
        <label for="timecommitment">
          Time commitment:
        </label>
        <b-textarea
          id="description"
          v-model="volunteering.timecommitment"
          rows="2"
          max-rows="8"
          spellcheck="true"
          placeholder="Please let people know what the time commitment is that you're looking for, e.g. how many hours a week, what times of day."
          class="mt-2"
        />
        <label for="location">
          Where is it?
        </label>
        <b-form-input id="location" v-model="volunteering.location" type="text" maxlength="80" placeholder="Where is it being held?  Add a postcode to make sure people can find you!" />
        <label>
          When is it?
        </label>
        <p>You can add multiple dates if the opportunity occurs several times.</p>
        <!-- TODO fix this to use v-model properly (as in components/CommunityEventModal.vue) -->
        <StartEndCollection v-if="volunteering.dates" :dates="volunteering.dates" @change="datesChange" />
        <label for="contactname">
          Contact name:
        </label>
        <b-form-input id="contactname" v-model="volunteering.contactname" type="text" maxlength="60" placeholder="Is there a contact person for anyone who wants to find out more? (Optional)" />
        <label for="contactemail">
          Contact email:
        </label>
        <b-form-input id="contactemail" v-model="volunteering.contactemail" type="email" placeholder="Can people reach you by email? (Optional)" />
        <label for="contactphone">
          Contact phone:
        </label>
        <b-form-input id="contactphone" v-model="volunteering.contactphone" type="tel" placeholder="Can people reach you by phone? (Optional)" />
        <label for="contacturl">
          Web link:
        </label>
        <b-form-input id="contacturl" v-model="volunteering.contacturl" type="url" placeholder="Is there more information on the web? (Optional)" />
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <div v-if="volunteering.canmodify" class="w-100">
        <b-button v-if="!editing" variant="white" class="float-left" @click="editing = true">
          <v-icon name="pen" />
          Edit
        </b-button>
        <b-button variant="white" class="float-left ml-1" @click="deleteIt">
          <v-icon name="trash-alt" />
          Delete
        </b-button>
      </div>
      <b-button v-if="!editing" variant="white" class="float-right" @click="cancel">
        Close
      </b-button>
      <b-button v-if="editing" variant="white" class="float-right" @click="dontSave">
        Cancel
      </b-button>
      <b-button v-if="editing" variant="success" class="float-right" @click="saveIt">
        <v-icon v-if="saving" name="sync" class="fa-spin" />
        <v-icon v-else name="save" />
        <span v-if="volunteering.id">Save Changes</span>
        <span v-else>Add Opportunity</span>
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
// TODO DESIGN This layout is staid table nonsense.  Surely we can make it more appealing?
// TODO Add some form validation using a plugin - see https://bootstrap-vue.js.org/docs/reference/validation/
// TODO Don't allow submission before image upload complete.
// TODO Groups which don't support opportunities
// TODO We used to have an "apply by" date. It's not clear we need this, so no urgency in re-adding it.
// TODO EH Systemwide opportunities.
import twem from '~/assets/js/twem'
const GroupRememberSelect = () => import('~/components/GroupRememberSelect')
const OurFilePond = () => import('~/components/OurFilePond')
const StartEndCollection = () => import('~/components/StartEndCollection')

export default {
  components: {
    GroupRememberSelect,
    OurFilePond,
    StartEndCollection
  },
  props: {
    volunteering: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    },
    startEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showModal: false,
      editing: false,
      groupid: null,
      uploading: false,
      oldphoto: null,
      olddates: null,
      cacheBust: Date.now(),
      saving: false
    }
  },
  computed: {
    description() {
      let desc = this.volunteering.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    }
  },
  methods: {
    show() {
      this.editing = this.startEdit
      this.showModal = true

      this.oldphoto =
        this.volunteering && this.volunteering.photo
          ? this.volunteering.photo.id
          : null
      this.olddates =
        this.volunteering && this.volunteering.dates
          ? JSON.parse(JSON.stringify(this.volunteering.dates))
          : null

      // If we don't have any dates, add an empty one so the slot appears for them to fill in.
      this.volunteering.dates = this.volunteering.dates
        ? this.volunteering.dates
        : [
            {
              start: null,
              end: null
            }
          ]

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
      await this.$store.dispatch('volunteering/delete', {
        id: this.volunteering.id
      })

      this.hide()
    },
    async saveIt() {
      // TODO Validation.
      this.saving = true

      if (this.volunteering.id) {
        // This is an edit.
        if (
          this.volunteering.photo &&
          this.volunteering.photo.id !== this.oldphoto
        ) {
          await this.$store.dispatch('volunteerops/setPhoto', {
            id: this.volunteering.id,
            photoid: this.volunteering.photo.id
          })
        }

        const oldgroupid = this.volunteering.groups
          ? this.volunteering.groups[0].id
          : null

        if (this.groupid !== oldgroupid) {
          // Save the new group, then remove the old group, so it won't get stranded.
          await this.$store.dispatch('volunteerops/addGroup', {
            id: this.volunteering.id,
            groupid: this.groupid
          })

          if (oldgroupid) {
            await this.$store.dispatch('volunteerops/removeGroup', {
              id: this.volunteering.id,
              groupid: oldgroupid
            })
          }
        }

        if (this.volunteering.dates && this.volunteering.dates.length) {
          await this.$store.dispatch('volunteerops/setDates', {
            id: this.volunteering.id,
            olddates: this.olddates,
            newdates: this.volunteering.dates
          })
        }

        await this.$store.dispatch('volunteerops/save', this.volunteering)
      } else {
        // This is an add.  First create it to get the id.
        const dates = this.volunteering.dates
        const photoid = this.volunteering.photo
          ? this.volunteering.photo.id
          : null

        const volunteeringid = await this.$store.dispatch(
          'volunteerops/add',
          this.volunteering
        )

        if (photoid) {
          await this.$store.dispatch('volunteerops/setPhoto', {
            id: volunteeringid,
            photoid: photoid
          })
        }

        // Save the group.
        await this.$store.dispatch('volunteerops/addGroup', {
          id: volunteeringid,
          groupid: this.groupid
        })

        if (this.volunteering.dates && this.volunteering.dates.length) {
          await this.$store.dispatch('volunteerops/setDates', {
            id: volunteeringid,
            olddates: [],
            newdates: dates
          })
        }

        // Fetch for good luck.
        await this.$store.dispatch('volunteerops/fetch', {
          id: volunteeringid
        })
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

      this.volunteering.photo = {
        id: imageid,
        path: image,
        paththumb: imagethumb
      }

      // TODO Handle any OCR returned from the server by putting it in the description.
    },
    rotate(deg) {
      this.$axios
        .post(process.env.API + '/image', {
          id: this.volunteering.photo.id,
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
    },
    datesChange(dates) {
      this.volunteering.dates = dates
    }
  }
}
</script>
