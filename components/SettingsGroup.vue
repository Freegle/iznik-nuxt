<template>
  <div>
    <b-row>
      <b-col cols="12" sm="6">
        <b-form-group
          label="OFFER and WANTED posts:"
        >
          <b-form-select :value="emailfrequency" @change="(newval) => outcast('emailfrequency', newval)">
            <option value="-1">
              Immediately
            </option>
            <option value="1">
              Every Hour
            </option>
            <option value="2">
              Every 2 Hours
            </option>
            <option value="4">
              Every 4 Hours
            </option>
            <option value="8">
              Every 8 Hours
            </option>
            <option value="24">
              Every day
            </option>
            <option value="0">
              Never
            </option>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="6">
        <b-btn v-if="leave" variant="white" class="float-right mt-4" @click="leaveGroup">
          <v-icon v-if="leaving" class="text-success fa-spin" />
          <v-icon v-else name="trash-alt" /> Leave
        </b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" sm="6">
        <b-form-group label="Community Event mails:">
          <toggle-button
            :value="eventsallowed"
            class="mt-2"
            :height="30"
            :width="100"
            :font-size="14"
            :sync="true"
            :labels="{checked: 'Weekly', unchecked: 'Off'}"
            color="#61AE24"
            @change="(newval) => outcast('eventsallowed', newval.value)"
          />
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="6">
        <b-form-group label="Volunteer Opportunity mails:">
          <toggle-button
            :value="volunteeringallowed"
            class="mt-2"
            :height="30"
            :width="100"
            :font-size="14"
            :sync="true"
            :labels="{checked: 'Weekly', unchecked: 'Off'}"
            color="#61AE24"
            @change="(newval) => outcast('volunteeringallowed', newval.value)"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  components: {
    ToggleButton
  },
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    },
    emailfrequency: {
      type: Number,
      required: true
    },
    eventsallowed: {
      type: Boolean,
      required: true
    },
    volunteeringallowed: {
      type: Boolean,
      required: true
    },
    leave: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      leaving: false
    }
  },
  methods: {
    outcast: function(param, val) {
      // The model for two-way props binding is that you emit an update event.  The parent component may use :sync,
      // in which case it will set the model value.
      //
      // You can use this in conjunction with computed properties, e.g. in settings.vue, by having a setter on the
      // computed property.
      //
      // The result of that is that a change in here ripples up to the parent which will then do something with the
      // change.
      this.$emit('update:' + param, val)
      this.$emit('change', {
        groupid: this.groupid,
        param: param,
        val: val
      })
    },
    leaveGroup: function() {
      this.leave = true
      this.$emit('leave')
    }
  }
}
</script>
