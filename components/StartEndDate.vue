<template>
  <div class="form__element p-2 d-flex justify-content-between flex-column flex-lg-row align-items-md-end">
    <div class="d-flex flex-column flex-md-row mb-3 mb-lg-0">
      <div class="mr-0 mr-md-4 mb-3 mb-md-0 d-flex flex-column">
        <label for="startDate" class="date__label">Starts at:</label>
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
        />
      </div>
      <div class="mr-lg-4 d-flex flex-column">
        <label for="endDate" class="date__label">Ends at:</label>
        <date-picker
          id="endDate"
          v-model="value.end"
          class=""
          lang="en"
          type="datetime"
          :format="format"
          :time-picker-options="{ start: '00:00', step: '00:30', end: '23:30', format: 'HH:mm' }"
          placeholder=""
        />
      </div>
    </div>
    <div>
      <b-btn v-if="removable" variant="white" size="sm" @click="$emit('remove')">
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
    }
  },
  created() {
    this.format = {
      stringify(date) {
        return date ? dayjs(date).format(FORMAT) : ''
      },
      parse(value) {
        return value ? dayjs(value, FORMAT).toDate() : null
      }
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
