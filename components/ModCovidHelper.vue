<template>
  <b-tr>
    <b-td>
      <a :href="'https://www.ilovefreegle.org/profile/' + helper.id" target="_blank">
        {{ helper.displayname }} {{ selected }}
      </a>
    </b-td>
    <b-td>
      {{ (Math.round(helper.distance * 10) / 10) | pluralize('mile', { includeNumber: true }) }}
    </b-td>
    <b-td>
      <v-icon v-if="helper.covid.phone" name="mobile-alt" title="Phone number provided" />
      <v-icon v-if="helper.covid.intro" name="book-open" title="Intro provided" />
      <v-icon v-if="info.other" name="comment" title="Comment to volunteers provided" />
    </b-td>
    <b-td>
      <b-btn v-if="helper.covid.info" variant="white" @click="showInfo = true">
        Response
      </b-btn>
      <b-modal
        v-if="helper.covid.info"
        :id="'helperModal-' + helper.id"
        ref="helperModal"
        v-model="showInfo"
        title="Their Response"
        no-stacking
        ok-only
        size="lg"
      >
        <template slot="default">
          <ModCovidInfo :covid="helper.covid" />
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button variant="white" @click="cancel">
            Close
          </b-button>
        </template>
      </b-modal>
    </b-td>
    <b-td>
      <div v-if="helper.info && helper.info.ratings">
        <b-btn :variant="helper.info.ratings.Up > 0 ? 'success' : 'white'" size="sm">
          <v-icon name="thumbs-up" />&nbsp;{{ helper.info.ratings.Up }}
        </b-btn>
        <b-btn :variant="helper.info.ratings.Down > 0 ? 'warning' : 'white'" size="sm">
          <v-icon name="thumbs-down" />&nbsp;{{ helper.info.ratings.Down }}
        </b-btn>
      </div>
    </b-td>
    <b-td>
      {{ helper.kudos }}
    </b-td>
    <b-td>
      <b-checkbox v-model="selected" @change="change" />
    </b-td>
  </b-tr>
</template>
<script>
import ModCovidInfo from './ModCovidInfo'

export default {
  components: { ModCovidInfo },
  props: {
    helper: {
      type: Object,
      required: true
    },
    helpee: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      showInfo: false
    }
  },
  computed: {
    info() {
      if (this.helper.covid && this.helper.covid.info) {
        if (this.helper.covid.info === '[]') {
          return {}
        } else {
          return JSON.parse(this.helper.covid.info)
        }
      } else {
        return {}
      }
    },
    selected: {
      get() {
        return this.helper.selected
      },
      set(val) {
        if (val) {
          this.$store.dispatch('covid/suggest', {
            helper: this.helper.id,
            helpee: this.helpee
          })
        } else {
          this.$store.dispatch('covid/remove', {
            helper: this.helper.id,
            helpee: this.helpee
          })
        }
      }
    }
  },
  methods: {
    change(val) {}
  }
}
</script>
