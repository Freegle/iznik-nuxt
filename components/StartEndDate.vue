<template>
  <b-card no-body class="m-0 mb-1">
    <b-card-body class="p-2">
      <b-row>
        <b-col cols="12" sm="5">
          <span class="align-middle text-muted">
            Starts at:
          </span>
          <date-picker
            v-model="startd"
            class="float-right mt-1"
            lang="en"
            type="datetime"
            append-to-body
            format="ddd, Do MMM HH:mm a"
            :time-picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
            placeholder="Choose date/time"
            @change="change"
          />
        </b-col>
        <b-col cols="12" sm="5">
          <span class="align-middle text-muted">
            Ends at:
          </span>
          <date-picker
            v-model="endd"
            class="float-right mt-1"
            lang="en"
            type="datetime"
            append-to-body
            format="ddd, Do MMM HH:mm a"
            :time-picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
            placeholder="Choose date/time"
            @change="change"
          />
        </b-col>
        <b-col cols="12" sm="2">
          <span title="Delete this date" class="d-none d-sm-inline float-right" @click="$emit('remove', index)">
            <v-icon name="trash-alt" scale="1.5" />
          </span>
          <span title="Delete this date" class="d-inlineblock d-sm-none">
            <b-btn variant="white" class="mt-2 mb-3" size="sm" @click="$emit('remove', index)">
              <v-icon name="trash-alt" /> Remove
            </b-btn>
          </span>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<script>
// TODO DESIGN The vertical alignment is a bit rubbish in here, and there's probably a way to make this look nicer.
export default {
  props: {
    start: {
      validator: prop => typeof prop === 'string' || prop === null,
      required: true
    },
    end: {
      validator: prop => typeof prop === 'string' || prop === null,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      startd: null,
      endd: null
    }
  },
  mounted: function() {
    this.startd = this.start
    this.endd = this.end
  },
  methods: {
    change() {
      this.$emit('change', this.index, {
        start: new Date(this.startd).toISOString(),
        end: new Date(this.endd).toISOString()
      })
    }
  }
}
</script>
