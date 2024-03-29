<template>
  <div>
    <client-only>
      <b-modal
        v-if="stdmsg"
        id="stdmsgmodal"
        v-model="showModal"
        :title="title"
        size="lg"
        no-stacking
      >
        <template slot="default">
          <label>Title</label>
          <b-input v-model="stdmsg.title" />
          <label>Action</label>
          <b-select v-model="stdmsg.action" :options="options" />
          <label>Edit Text</label>
          <b-select v-if="stdmsg.action === 'Edit'" v-model="stdmsg.edittext">
            <option value="Unchanged">
              Unchanged
            </option>
            <option value="Correct Case">
              Correct Case
            </option>
          </b-select>
          <label>Autosend?</label>
          <b-select v-model="stdmsg.autosend">
            <option :value="0">
              Edit before send
            </option>
            <option :value="1">
              Send Immediately
            </option>
          </b-select>
          <label>How often do you use this?</label>
          <b-select v-model="stdmsg.rarelyused">
            <option :value="0">
              Frequently
            </option>
            <option :value="1">
              Rarely
            </option>
          </b-select>
          <label>Change Moderation Status *</label>
          <b-select v-model="stdmsg.newmodstatus">
            <option value="UNCHANGED">
              Unchanged
            </option>
            <option value="MODERATED">
              Moderated
            </option>
            <option value="DEFAULT">
              Group Settings
            </option>
            <option value="PROHIBITED">
              Can't Post
            </option>
            <option value="UNMODERATED">
              Unmoderated
            </option>
          </b-select>
          <label>Change Delivery Settings *</label>
          <b-select v-model="stdmsg.newdelstatus">
            <option value="UNCHANGED">
              Unchanged
            </option>
            <option value="DIGEST">
              Daily Digest
            </option>
            <option value="NONE">
              Web Only
            </option>
            <option value="SINGLE">
              Individual Emails
            </option>
            <option value="ANNOUNCEMENT">
              Special Notices
            </option>
          </b-select>
          <label>Subject Prefix</label>
          <b-input v-model="stdmsg.subjpref" />
          <label>Subject Suffix</label>
          <b-input v-model="stdmsg.subjsuff" />
          <label>Insert Text</label>
          <b-select v-model="stdmsg.insert">
            <option value="Top">
              Top
            </option>
            <option value="Bottom">
              Bottom
            </option>
          </b-select>
          <label>Message Body</label>
          <b-textarea v-model="stdmsg.body" rows="10" />
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <div class="d-flex justify-content-between flex-wrap w-100">
            <div>
              <b-button v-if="id && !locked" variant="danger" @click="deleteIt">
                Delete
              </b-button>
            </div>
            <div>
              <b-button variant="white" class="mr-2" @click="cancel">
                Cancel
              </b-button>
              <b-button v-if="!locked" variant="primary" :disabled="!stdmsg.title" @click="save">
                <span v-if="id">Save</span>
                <span v-else>Add</span>
              </b-button>
            </div>
          </div>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'

export default {
  mixins: [modal],
  props: {
    id: {
      type: Number,
      required: false,
      default: null
    },
    types: {
      type: Array,
      required: false,
      default: null
    }
  },
  data: function() {
    const ret = {
      newmsg: [],
      options: [
        { value: null, text: '-- Pending Messages -- ' },
        { value: 'Approve', text: 'Approve' },
        { value: 'Reject', text: 'Reject' },
        { value: 'Leave', text: 'Reply' },
        { value: 'Edit', text: 'Edit' },
        { value: 'Hold Message', text: 'Reply and Hold' },
        { value: null, text: '-- Approved Messages -- ' },
        { value: 'Delete Approved Message', text: 'Delete' },
        { value: 'Leave Approved Message', text: 'Reply' },
        { value: null, text: '-- Approved Members --' },
        { value: 'Delete Approved Member', text: 'Remove' },
        { value: 'Leave Approved Member', text: 'Reply' }
      ]
    }

    if (this.types) {
      ret.options = ret.options.filter(o => this.types.includes(o.value))
    }

    return ret
  },
  computed: {
    locked() {
      return (
        this.config &&
        this.config.protected &&
        parseInt(this.config.createdby) !== this.myid
      )
    },
    config() {
      return this.$store.getters['modconfigs/current']
    },
    stdmsg() {
      if (!this.id) {
        // Creating.
        return this.newmsg
      } else {
        // Existing - find it in the config.
        return this.config
          ? this.config.stdmsgs.find(s => {
              return s.id === this.id
            })
          : null
      }
    },
    title() {
      if (!this.id) {
        return 'Create a standard message'
      } else if (this.locked) {
        return 'View ' + this.stdmsg.title
      } else {
        return 'Edit ' + this.stdmsg.title
      }
    }
  },
  methods: {
    async show() {
      // Fetch the current value, if any, before opening the modal.
      if (this.id) {
        await this.$store.dispatch('stdmsgs/fetch', {
          id: this.id
        })
      }

      this.showModal = true
    },
    hide() {
      this.showModal = false
      this.$emit('hide')
    },
    async save() {
      if (!this.id) {
        await this.$store.dispatch('stdmsgs/add', {
          ...this.stdmsg,
          configid: this.config.id
        })
      } else {
        await this.$store.dispatch('stdmsgs/update', {
          ...this.stdmsg
        })
      }

      this.hide()
    },
    async deleteIt() {
      await this.$store.dispatch('stdmsgs/delete', {
        id: this.stdmsg.id,
        configid: this.config.id
      })

      this.hide()
    }
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
  margin-top: 1rem;
}
</style>
