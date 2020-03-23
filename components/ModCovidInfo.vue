<template>
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
            readonly
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
            readonly
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
            readonly
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
            readonly
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
            readonly
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
            readonly
          />
        </b-td>
      </b-tr>
      <b-tr>
        <b-td>
          Phone number
        </b-td>
        <b-td>
          <b>{{ covid.phone }}</b>
        </b-td>
      </b-tr>
      <b-tr>
        <b-td colspan="2">
          <p>Info provided to volunteers on initial response:</p>
          <b-textarea v-model="info.other" placeholder="No info provided to volunteers" readonly rows="4" />
        </b-td>
      </b-tr>
      <b-tr>
        <b-td colspan="2">
          <p>Intro provided on follow up mail</p>
          <b-textarea v-model="covid.intro" placeholder="No intro provided" readonly rows="4" />
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>
<script>
import Vue from 'vue'
import { TablePlugin } from 'bootstrap-vue'

Vue.use(TablePlugin)

export default {
  props: {
    covid: {
      type: Object,
      required: true
    }
  },
  computed: {
    info() {
      if (this.covid && this.covid.info) {
        if (this.covid.info === '[]') {
          return {}
        } else {
          return JSON.parse(this.covid.info)
        }
      } else {
        return {}
      }
    }
  }
}
</script>
