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
                close-button
                button-only
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
            v-model="time"
            locale="en"
            placeholder="Choose a time"
            :minutes-step="15"
            dropleft
          />
        </div>
        <div class="d-flex flex-column justify-content-center">
          <b-btn v-if="time" variant="link" @click="deleteTryst">
            Cancel
          </b-btn>
        </div>
      </div>
      <p class="mt-2 text-muted">
        If you say when the handover is happening we can remind both of you, which makes things go more smoothly.
        If you've not arranged a time yet, you can come back here later by clicking on the <em>Promise</em> button again.
      </p>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
      <b-button variant="primary" :disabled="!messages || messages.length === 0 || !message" @click="promise">
        Promise
      </b-button>
    </template>
  </b-modal>
</template>

<script>
// TODO:
// - if not handover date arranged, how do you do so from my posts?
// - prompt to use promise.
import Vue from 'vue'
import { FormTimepickerPlugin, FormDatepickerPlugin } from 'bootstrap-vue'
Vue.use(FormTimepickerPlugin)
Vue.use(FormDatepickerPlugin)

const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    NoticeMessage
  },
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
      showModal: false,
      message: null,
      date: null,
      time: null,
      formattedDate: null
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
    date: {
      immediate: true,
      handler(newVal) {
        if (newVal && !this.time) {
          // Default the time.
          this.time = this.$dayjs()
            .minute(Math.ceil(this.$dayjs().minute() / 15) * 15)
            .format('HH:mm:ss')
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

      const arrangedfor = this.$dayjs(this.date + ' ' + this.time).toISOString()

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

      this.hide()
    },
    show() {
      this.showModal = true
      this.message = this.selectedMessage
      this.$store.dispatch('tryst/fetch')
    },
    hide() {
      this.showModal = false
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
    }
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
}
</style>
