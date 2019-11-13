<template>
  <b-modal
    id="profilemodal"
    v-model="showModal"
    size="lg"
    no-stacking
  >
    <template slot="modal-header">
      <h4 v-if="editing">
        <span v-if="event.id">
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
          <b-alert show variant="info">
            Scroll down past the picture for more information!
          </b-alert>
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
      <div v-else>
        <b-row>
          <b-col cols="12" md="6">
            <label for="group">
              For which community?
            </label>
            <groupRememberSelect v-model="groupid" remember="editevent" />
            <label for="title">
              What's the event's name?
            </label>
            <b-form-input id="title" v-model="event.title" type="text" maxlength="80" placeholder="Give the event a short title" />
          </b-col>
          <b-col cols="12" md="6">
            <div class="float-right">
              <div v-if="event.photo" class="container p-0">
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
              <b-img v-if="event.photo" thumbnail :src="event.photo.paththumb + '?' + cacheBust" />
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
              imgtype="CommunityEvent"
              imgflag="communitevent"
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
          v-model="event.description"
          rows="5"
          max-rows="8"
          spellcheck="true"
          placeholder="Let people know what the event is - why they should come, what to expect, and any admission charge or fee (we only approve free or cheap events)."
          class="mt-2"
        />
        <label for="location">
          Where is it?
        </label>
        <b-form-input id="location" v-model="event.location" type="text" maxlength="80" placeholder="Where is it being held?  Add a postcode to make sure people can find you!" />
        <label>
          When is it?
        </label>
        <p>You can add multiple dates if the event occurs several times.</p>
        <StartEndCollection v-if="event.dates" v-model="event.dates" />
        <label for="contactname">
          Contact name:
        </label>
        <b-form-input id="contactname" v-model="event.contactname" type="text" maxlength="60" placeholder="Is there a contact person for anyone who wants to find out more? (Optional)" />
        <label for="contactemail">
          Contact email:
        </label>
        <b-form-input id="contactemail" v-model="event.contactemail" type="email" placeholder="Can people reach you by email? (Optional)" />
        <label for="contactphone">
          Contact phone:
        </label>
        <b-form-input id="contactphone" v-model="event.contactphone" type="tel" placeholder="Can people reach you by phone? (Optional)" />
        <label for="contacturl">
          Web link:
        </label>
        <b-form-input id="contacturl" v-model="event.contacturl" type="url" placeholder="Is there more information on the web? (Optional)" />
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <div v-if="event.canmodify" class="w-100">
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
        <span v-if="event.id">Save Changes</span>
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
// TODO Groups which don't support events
// TODO Wherever we have b-img (throughout the site, not just here) we should have @brokenImage.  Bet we don't.
// TODO Set date to start at 9am rather than midnight.  Default end date to later than start date.
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
    event: {
      type: Object,
      default: () => ({
        title: null,
        photo: null,
        description: null,
        location: null,
        dates: [],
        contactname: null,
        contactemail: null,
        contactphone: null,
        contacturl: null
      })
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
      groupid: 0,
      uploading: false,
      oldphoto: null,
      olddates: null,
      cacheBust: Date.now(),
      saving: false
    }
  },
  computed: {
    description() {
      let desc = this.event.description
      desc = desc ? twem.twem(this.$twemoji, desc) : ''
      desc = desc.trim()
      return desc
    }
  },
  methods: {
    async show() {
      this.editing = this.startEdit
      this.showModal = true

      this.oldphoto =
        this.event && this.event.photo ? this.event.photo.id : null
      this.olddates =
        this.event && this.event.dates
          ? JSON.parse(JSON.stringify(this.event.dates))
          : null

      // If we don't have any dates, add an empty one so the slot appears for them to fill in.
      this.event.dates = this.event.dates
        ? this.event.dates
        : [
            {
              start: null,
              end: null,
              uniqueid: await this.$store.dispatch('uniqueid/generate')
            }
          ]

      // If we don't have any groups, force a select.
      this.event.groups = this.event.groups ? this.event.groups : [{ id: 0 }]
    },
    hide() {
      this.editing = false
      this.uploading = false
      this.showModal = false
      this.saving = false
    },
    async deleteIt() {
      await this.$store.dispatch('communityevents/delete', {
        id: this.event.id
      })

      this.hide()
    },
    async saveIt() {
      // TODO Validation.
      this.saving = true

      if (this.event.id) {
        // This is an edit.
        if (this.event.photo && this.event.photo.id !== this.oldphoto) {
          await this.$store.dispatch('communityevents/setPhoto', {
            id: this.event.id,
            photoid: this.event.photo.id
          })
        }

        const oldgroupid = this.event.groups ? this.event.groups[0].id : null

        if (this.groupid !== oldgroupid) {
          // Save the new group, then remove the old group, so it won't get stranded.
          await this.$store.dispatch('communityevents/addGroup', {
            id: this.event.id,
            groupid: this.groupid
          })

          if (oldgroupid) {
            await this.$store.dispatch('communityevents/removeGroup', {
              id: this.event.id,
              groupid: oldgroupid
            })
          }
        }

        await this.$store.dispatch('communityevents/setDates', {
          id: this.event.id,
          olddates: this.olddates,
          newdates: this.event.dates
        })

        await this.$store.dispatch('communityevents/save', this.event)
      } else {
        // This is an add.  First create it to get the id.
        const dates = this.event.dates
        const photoid = this.event.photo ? this.event.photo.id : null

        const eventid = await this.$store.dispatch(
          'communityevents/add',
          this.event
        )

        if (photoid) {
          await this.$store.dispatch('communityevents/setPhoto', {
            id: eventid,
            photoid: photoid
          })
        }

        // Save the group.
        await this.$store.dispatch('communityevents/addGroup', {
          id: eventid,
          groupid: this.groupid
        })

        await this.$store.dispatch('communityevents/setDates', {
          id: eventid,
          olddates: [],
          newdates: dates
        })

        // Fetch for good luck.
        await this.$store.dispatch('communityevents/fetch', {
          id: eventid
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
    photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      this.event.photo = {
        id: imageid,
        path: image,
        paththumb: imagethumb
      }

      // TODO EH Handle any OCR returned from the server by putting it in the description.
    },
    rotate(deg) {
      this.$axios
        .post(process.env.API + '/image', {
          id: this.event.photo.id,
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
  }
}
</script>
