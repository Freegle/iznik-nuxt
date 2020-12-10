<template>
  <div class="form__element p-2 d-flex justify-content-between flex-column flex-lg-row align-items-md-end">
    <div class="d-flex flex-column flex-md-row mb-3 mb-lg-0">
      <div class="mr-0 mr-md-4 mb-3 mb-md-0 d-flex flex-column">
        <label for="startDate" class="date__label">{{ fromLabel }}</label>
        <!-- Add form-control class to get focus etc. -->
        <date-picker
          id="startDate"
          v-model="value.start"
          class=""
          lang="en"
          type="datetime"
          :format="format"
          :time-picker-options="{ start: '00:00', step: '00:30', end: '23:30', format: 'HH:mm' }"
          placeholder=""
          :disabled-date="startDateDisabled"
          :default-value="todayAt9am"
          :editable="false"
        />
      </div>
      <div class="mr-lg-4 d-flex flex-column">
        <label for="endDate" class="date__label">{{ toLabel }}</label>
        <date-picker
          id="endDate"
          v-model="value.end"
          class=""
          lang="en"
          type="datetime"
          :format="format"
          :time-picker-options="{ start: '00:00', step: '00:30', end: '23:30', format: 'HH:mm' }"
          placeholder=""
          :disabled-date="endDateDisabled"
          :disabled-time="endTimeDisabled"
          :default-value="oneHourAfterStart"
          :editable="false"
        />
      </div>
    </div>
    <div>
      <b-btn v-if="removable" variant="secondary" size="sm" @click="$emit('remove')">
        <v-icon name="trash-alt" title="Delete this date" aria-hidden="true" />
        <span class="delete__label">Remove</span>
      </b-btn>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

import dayjs from 'dayjs'

// Minimum length of event (it's rounded to 30 minute intervals anyway)
const MIN_DURATION_MINUTES = 30

const FORMAT = 'ddd, Do MMM HH:mm a'

export default {
  components: {
    DatePicker
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    removable: {
      type: Boolean,
      required: false,
      default: true
    },
    fromLabel: {
      type: String,
      required: false,
      default: 'Starts at:'
    },
    toLabel: {
      type: String,
      required: false,
      default: 'Ends at:'
    },
    maxDurationDays: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    oneHourAfterStart() {
      return dayjs(this.value ? this.value.start : null).add(1, 'hour')
    }
  },
  watch: {
    'value.start'(start, oldStart) {
      if (start) {
        // when the start changes, shift the end too
        const unit = dayjs(oldStart).isSame(dayjs(this.value.end), 'day')
          ? // if start/end are on the same day, shift the end time
            'minute'
          : // otherwise only shift the end day
            'day'
        const changed = dayjs(start).diff(oldStart, unit)
        if (changed !== 0) {
          this.value.end = dayjs(this.value.end)
            .add(changed, unit)
            .toDate()
        }
      } else {
        // clear the end date when the start date is cleared
        this.value.end = null
      }
    }
  },
  created() {
    // used for default start date, 9am bright and early :)
    this.todayAt9am = dayjs()
      .hour(9)
      .minute(0)
      .second(0)

    // custom formatter using dayjs
    this.format = {
      stringify(date) {
        return date ? dayjs(date).format(FORMAT) : ''
      },
      parse(value) {
        return value ? dayjs(value, FORMAT).toDate() : null
      }
    }
  },
  methods: {
    startDateDisabled(date) {
      // not before today
      return dayjs(date).isBefore(dayjs(), 'day')
    },
    endDateDisabled(date) {
      let invalid =
        // not before today
        dayjs(date).isBefore(dayjs(), 'day') ||
        // not before the start date
        dayjs(date).isBefore(dayjs(this.value.start), 'day')

      if (this.maxDurationDays && !invalid) {
        // not too many days long
        invalid = dayjs(date).isAfter(
          dayjs(this.value.start).add(this.maxDurationDays - 1, 'day'),
          'day'
        )
      }

      return invalid
    },
    endTimeDisabled(date) {
      // at least 30 minutes after the start time
      return dayjs(date).isBefore(
        dayjs(this.value.start).add(MIN_DURATION_MINUTES, 'minute')
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.form__element {
  border: 1px solid $color-green--lighter;
  border-radius: 0.25rem;
}

.date__label {
  /* Override the style from bootstrap */
  margin-bottom: 0;
}

/* Override the class from Vue2 Datepicker */
.mx-datepicker {
  width: 100%;
}

.delete__label {
  font-size: 14px;
}

/* Style the icon inside the v-icon component */
.fa-icon {
  width: auto;
  height: 16px;
}
</style>
