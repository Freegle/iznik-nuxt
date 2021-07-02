<template>
  <b-modal
    id="promisemodal"
    v-model="showModal"
    title="Promise something to someone"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <notice-message class="mb-3">
        This lets them know you're planning to give it to them, and helps you keep track.
        You can change your mind later if it doesn't work out, using the  <em>Unpromise</em> button.
      </notice-message>
      <p>You're promising:</p>
      <b-select v-model="message" :options="messageOptions" class="mb-2 font-weight-bold" />
      <div class="d-flex justify-content-between flex-wrap">
        <div>
          <label for="who">To:</label>
          <b-select id="who" v-model="selectedUser" :options="userOptions" class="mb-2 font-weight-bold" />
        </div>
        <div>
          <label for="date">
            Handover on:
          </label>
          <b-input-group class="mb-3">
            <b-form-input
              id="date"
              ref="dateInput"
              v-model="formattedDate"
              type="text"
              placeholder="No day yet"
              autocomplete="off"
              @focus="openPicker"
            />
            <b-input-group-append>
              <b-form-datepicker
                ref="datePicker"
                v-model="date"
                locale="en"
                :min="minDate"
                :max="maxDate"
                nav-button-variant="primary"
                reset-button
                :reset-value="null"
                close-button
                button-only
                label-reset-button="Clear"
                :label-help="null"
                @context="onContext"
              >
                <template slot="button-content">
                  <div class="align-content-center">
                    <v-icon name="calendar-alt" />
                    Choose a day
                  </div>
                </template>
              </b-form-datepicker>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div>
          <label for="time">at:</label>
          <b-form-timepicker
            id="time"
            v-model="time"
            locale="en"
            placeholder="Choose a time"
            :minutes-step="15"
            :offset="-10"
            menu-class="border-primary shadow-lg"
            :class="(date && !time) ? 'border-danger' : ''"
            @hidden="considerOddTime"
          />
        </div>
        <div class="d-flex flex-column justify-content-center">
          <b-btn v-if="time" variant="link" @click="deleteTryst">
            Cancel
          </b-btn>
        </div>
      </div>
      <b-alert v-if="showOddTime" show variant="warning">
        This is an early/late time.  Just saying, in case it's not right.
      </b-alert>
      <p class="mt-2 text-muted">
        If you say when the handover is happening we can remind both of you, which makes things go more smoothly.
        If you don't want to specify a precise day/time yet, you can still click the <em>Promise</em> button.  And
        you can come back here later.
      </p>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="primary" :disabled="buttonDisabled" @click="promise">
        Promise
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import modal from '@/mixins/modal'
import Vue from 'vue'
import { FormTimepickerPlugin, FormDatepickerPlugin } from 'bootstrap-vue'
Vue.use(FormTimepickerPlugin)
Vue.use(FormDatepickerPlugin)

const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    NoticeMessage
  },
  mixins: [modal],
  props: {
    messages: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    },
    selectedMessage: {
      type: Number,
      required: false,
      default: 0
    },
    users: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    },
    selectedUser: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data: function() {
    return {
      message: null,
      date: null,
      time: null,
      formattedDate: null,
      showOddTime: false
    }
  },
  computed: {
    minDate() {
      return this.$dayjs().toDate()
    },
    maxDate() {
      return this.$dayjs()
        .add(14, 'day')
        .toDate()
    },
    buttonDisabled() {
      return (
        this.selectedUser <= 0 ||
        !this.messages ||
        this.messages.length === 0 ||
        !this.message ||
        // This is fun.  Because && returns one of the values, it doesn't return true or false.  Try hard.
        // eslint-disable-next-line
        (this.date && !this.time ? true : false)
      )
    },
    messageOptions() {
      const options = []

      if (this.messages) {
        if (this.messages.length > 1) {
          options.push({
            value: 0,
            text: '-- Please choose --'
          })
        }

        for (const message of this.messages) {
          if (!message.outcomes || message.outcomes.length === 0) {
            options.push({
              value: message.id,
              text: message.subject
            })
          }
        }
      } else {
        options.push({
          value: 0,
          text: '...Loading...',
          selected: true
        })
      }

      return options
    },
    userOptions() {
      const options = []

      if (this.users) {
        if (this.users.length > 1) {
          options.push({
            value: 0,
            text: '-- Please choose a user --',
            selected: this.selectedUser === 0
          })
        }

        for (const user of this.users) {
          options.push({
            value: user.id,
            text: user.displayname,
            selected: parseInt(this.message) === parseInt(user.id)
          })
        }
      }

      return options
    },
    tryst() {
      return this.selectedUser
        ? this.$store.getters['tryst/getByUser'](this.selectedUser)
        : null
    }
  },
  watch: {
    messages: {
      immediate: true,
      handler(newVal) {
        let selected = false

        if (newVal) {
          // Maybe the selected message we picked up from a chat no longer exists.
          newVal.forEach(m => {
            if (
              (!m.outcomes || m.outcomes.length === 0) &&
              parseInt(m.id) === parseInt(this.message)
            ) {
              selected = true
              this.message = m.id
            }
          })

          if (!selected) {
            this.message = 0
          }
        }
      }
    },
    tryst: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const d = this.$dayjs(newVal.arrangedfor)
          this.date = d.format('YYYY-MM-DD')
          this.time = d.format('HH:mm:ss')
        } else {
          this.date = null
          this.time = null
        }
      }
    }
  },
  methods: {
    async promise() {
      await this.$store.dispatch('messages/promise', {
        id: this.message,
        userid: this.selectedUser
      })

      const arrangedfor =
        this.time && this.date
          ? this.$dayjs(this.date + ' ' + this.time).toISOString()
          : null

      if (arrangedfor) {
        if (!this.tryst) {
          // No arrangement yet.
          await this.$store.dispatch('tryst/add', {
            user1: this.myid,
            user2: this.selectedUser,
            arrangedfor: arrangedfor
          })
        } else {
          // Update
          await this.$store.dispatch('tryst/edit', {
            id: this.tryst.id,
            arrangedfor: arrangedfor
          })
        }

        // Fetch the trysts again, to make sure we show messages correctly on the chat.
        this.$store.dispatch('tryst/fetch')
      }

      this.hide()
    },
    async show(date) {
      this.showModal = true
      this.message = this.selectedMessage

      // Fetch any existing trysts.
      await this.$store.dispatch('tryst/fetch')

      if (date) {
        // Explicit date -set it (overriding any in the tryst).
        this.$nextTick(() => {
          this.date = date.format('YYYY-MM-DD')
        })
      }
    },
    onContext(ctx) {
      if (ctx.selectedYMD) {
        this.formattedDate = this.$dayjs(ctx.selectedYMD).format('dddd Do')
      } else {
        this.formattedDate = null
      }
    },
    openPicker() {
      if (this.$refs.datePicker) {
        this.$refs.datePicker.$el.click()
      }
    },
    deleteTryst() {
      this.$store.dispatch('tryst/delete', {
        id: this.tryst.id
      })
    },
    considerOddTime() {
      this.showOddTime =
        this.time && (this.time < '07:00' || this.time > '21:00')
    }
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
}

/deep/ .b-calendar-nav {
  display: none !important;
}
</style>
