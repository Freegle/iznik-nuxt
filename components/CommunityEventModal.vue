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
              <b-img-lazy v-if="event.photo" thumbnail :src="event.photo.paththumb" />
              <b-img-lazy v-else thumbnail src="~/static/placeholder.jpg" />
            </div>
          </b-col>
        </b-row>
        <label for="description">
          What is it?
        </label>
        <b-textarea
          id="description"
          v-model="description"
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
      <b-button v-if="editing" variant="white" class="float-right" @click="cancel">
        Cancel
      </b-button>
      <b-button v-if="editing" variant="success" class="float-right" @click="cancel">
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
</style>
<script>
// TODO DESIGN This layout is staid table nonsense.  Surely we can make it more appealing?
// TODO Delete
// TODO Add some form validation using a plugin - see https://bootstrap-vue.js.org/docs/reference/validation/
// TODO Groups which don't support events
// TODO Wherever we have b-img we should have @brokenImage.  Bet we don't.
import twem from '~/assets/js/twem'
const GroupSelect = () => import('~/components/GroupSelect.vue')

export default {
  components: {
    GroupSelect
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
      groupid: null
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
      this.showModal = false
    },
    deleteIt() {},
    groupChange: function(val) {
      this.groupid = val
    }
  }
}
</script>
