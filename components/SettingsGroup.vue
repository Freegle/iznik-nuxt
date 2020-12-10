<template>
  <div>
    <b-row>
      <b-col cols="12" sm="6">
        <b-form-group
          label="OFFER and WANTED posts:"
        >
          <b-form-select :value="emailfrequency" :class="highlightEmailFrequencyIfOn" @change="(newval) => outcast('emailfrequency', newval)">
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
      <b-col v-if="leave" cols="12" sm="6">
        <b-btn variant="secondary" class="float-right mt-4" @click="leaveGroup">
          <v-icon v-if="leaving" class="text-success fa-spin" />
          <v-icon v-else name="trash-alt" /> Leave
        </b-btn>
      </b-col>
      <b-col v-if="moderation && membership">
        <b-form-group
          label="Moderation status:"
        >
          <ModModeration v-if="user" :membership="membership" :user="user" size="md" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-if="!simple || modtools">
      <b-col cols="12" sm="6">
        <b-form-group label="Community Event mails:">
          <OurToggle
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
          <OurToggle
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
import ModModeration from './ModModeration'
const OurToggle = () => import('~/components/OurToggle')

export default {
  components: {
    ModModeration,
    OurToggle
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
    },
    moderation: {
      type: String,
      required: false,
      default: null
    },
    userid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      leaving: false
    }
  },
  computed: {
    modtools() {
      return this.$store.getters['misc/get']('modtools')
    },
    user() {
      return this.userid ? this.$store.getters['user/get'](this.userid) : null
    },
    membership() {
      let ret = null

      if (this.user && this.user.memberof) {
        this.user.memberof.forEach(g => {
          if (g.id === this.groupid) {
            ret = g
          }
        })
      }

      return ret
    },
    highlightEmailFrequencyIfOn() {
      // 0 = Never receive email
      // All other values are receiving email
      return this.emailfrequency === 0
        ? 'email-frequency__dropdown--off'
        : 'email-frequency__dropdown--on'
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

<style scoped lang="scss">
@import 'color-vars';

.email-frequency__dropdown--on {
  border: 2px solid $colour-success;
}

.email-frequency__dropdown--off {
  border: 1px solid $color-gray-4;
}
</style>
