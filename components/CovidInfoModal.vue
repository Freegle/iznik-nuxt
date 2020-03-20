<template>
  <div>
    <client-only>
      <b-modal
        id="CovidInfo"
        v-model="showModal"
        :title="type === 'CanHelp' ? 'How can you help?' : 'What do you need?'"
        no-stacking
      >
        <template slot="default">
          <b-table-simple>
            <b-tbody>
              <b-tr>
                <b-td>
                  Shopping/prescriptions
                </b-td>
                <b-td>
                  <b-form-checkbox
                    id="checkbox-shopping"
                    v-model="info.shopping"
                  />
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  Taking out bins
                </b-td>
                <b-td>
                  <b-form-checkbox
                    id="checkbox-bins"
                    v-model="info.bins"
                  />
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  Making a meal
                </b-td>
                <b-td>
                  <b-form-checkbox
                    id="checkbox-meal"
                    v-model="info.meal"
                  />
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  Dog-walking
                </b-td>
                <b-td>
                  <b-form-checkbox
                    id="checkbox-dogs"
                    v-model="info.dogs"
                  />
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  Phone/Online chat
                </b-td>
                <b-td>
                  <b-form-checkbox
                    id="checkbox-online"
                    v-model="info.online"
                  />
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>
                  Organising this response
                </b-td>
                <b-td>
                  <b-form-checkbox
                    id="checkbox-organising"
                    v-model="info.organising"
                  />
                </b-td>
              </b-tr>
              <b-tr>
                <b-td colspan="2">
                  <b-textarea v-model="info.other" placeholder="Anything other info for our volunteers?" />
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </template>
        <template slot="modal-footer">
          <b-button variant="success" @click="hide">
            Save
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import Vue from 'vue'
import { TablePlugin } from 'bootstrap-vue'

Vue.use(TablePlugin)

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showModal: false,
      info: {}
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    async hide() {
      await this.$store.dispatch('covid/record', {
        type: this.type,
        info: this.info
      })

      this.$emit('hide')
      this.showModal = false
    }
  }
}
</script>
