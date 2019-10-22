<template>
  <b-modal
    v-if="event"
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
      <h4 v-else>
        {{ event.title }}
      </h4>
    </template>
    <template slot="default">
      <div v-if="!editing">
        <div v-if="event.photo">
          <b-alert show variant="info">
            Scroll down past the picture for more information!
          </b-alert>
          <b-img lazy fluid :src="event.photo.path" class="mb-2" />
        </div>
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
            <div v-for="(date, index) in event.dates" :key="'event-' + event.id + '-' + index + '-' + date.start.toString() + '-' + date.end.toString()" :class="date.string.past ? 'inpast': ''">
              {{ date.string.start }} - {{ date.string.end }}<br>
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
        <b-row>
          <b-col class="mt-2">
            <b>{{ description }}</b>
          </b-col>
        </b-row>

        <br>
        <a :href="event.url" target="_blank">{{ event.url }}</a>
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
            <groupSelect id="editevent" class="" @change="groupChange" />
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
                      style="color: white;"
                    />
                  </v-icon>
                </span>
                <span @click="rotateRight">
                  <v-icon label="Rotate right" class="topright clickme" title="Rotate right" flip="horizontal">
                    <v-icon name="circle" scale="2" />
                    <v-icon
                      name="reply"
                      style="color: white;"
                    />
                  </v-icon>
                </span>
              </div>
              <b-img-lazy v-if="event.photo" thumbnail :src="event.photo.paththumb + '?' + cacheBust" />
              <b-img-lazy v-else thumbnail src="~/static/placeholder.jpg" />
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
        <span v-if="event.id">Save Changes</span>
        <span v-else>Add Event</span>
      </b-button>
    </template>
  </b-modal>
</template>
<style scoped>
.field {
  font-weight: bold;
  color: darkgreen;
}

label {
  font-weight: bold;
  color: darkgreen;
  margin-top: 10px;
}

.inpast {
  text-decoration: line-through;
  color: #6c757d70;
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
</style>
<script>
// TODO DESIGN This layout is staid table nonsense.  Surely we can make it more appealing?
// TODO Delete
// TODO Add some form validation using a plugin - see https://bootstrap-vue.js.org/docs/reference/validation/
// TODO Groups which don't support events
// TODO Wherever we have b-img we should have @brokenImage.  Bet we don't.
import twem from '~/assets/js/twem'
const GroupSelect = () => import('~/components/GroupSelect.vue')
const OurFilePond = () => import('~/components/OurFilePond')

export default {
  components: {
    GroupSelect,
    OurFilePond
  },
  props: {
    event: {
      type: Object,
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
      cacheBust: new Date().getTime()
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
  mounted() {
    this.editing = this.startEdit
    this.oldphoto = this.event.photo ? this.event.photo.id : null
  },
  methods: {
    show() {
      this.showModal = true

      // Store the group id we're using for the select to pick up.
      // TODO This seems a poor way to signal it.
      if (this.event.groups && this.event.groups.length) {
        this.$store.commit('group/remember', {
          id: 'editevent',
          val: this.event.groups[0].id
        })

        this.groupid = this.event.groups[0].id
      }
    },
    hide() {
      this.editing = false
      this.uploading = false
      this.showModal = false
    },
    deleteIt() {},
    async saveIt() {
      // TODO Validation.
      console.log('Consider photo', this.event.photo)
      if (this.event.photo && this.event.photo.id !== this.oldphoto) {
        await this.$store.dispatch('communityevents/setPhoto', {
          id: this.event.id,
          photoid: this.event.photo.id
        })
      }

      if (this.event.id) {
        // This is an edit.
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

        await this.$store.dispatch('communityevents/save', this.event)
      } else {
        // This is an add
      }

      // Fetch for good luck.
      await this.$store.dispatch('communityevents/fetch', {
        id: this.event.id
      })

      this.hide()
    },
    async dontSave() {
      // We may have updated the event during the edit.  Fetch it again to reset those changes.
      await this.$store.dispatch('communityevents/fetch', {
        id: this.event.id
      })

      this.hide()
    },
    groupChange: function(val) {
      this.groupid = val
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

      console.log('Save photo', this.event.photo)
      // TODO Handle any OCR returned from the server by putting it in the description.
    },
    rotate(deg) {
      this.$axios
        .post(process.env.API + '/image', {
          id: this.event.photo.id,
          rotate: deg,
          bust: new Date().getTime(),
          communityevent: true
        })
        .then(() => {
          this.cacheBust = new Date().getTime()
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
