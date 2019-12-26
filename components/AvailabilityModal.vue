<template>
  <div>
    <client-only>
      <b-modal
        id="availabilitymodal"
        v-model="showModal"
        :title="mine ? 'When are you available?' : 'Their availability'"
        :alt="mine ? 'When are you available?' : 'Their availability'"
        size="lg"
        no-stacking
      >
        <template slot="default">
          <p v-if="mine">
            We can help you arrange a collection time. If you want to, <b>tell us when you're available</b> in the next few days.
            You don't have to do this, and you can still agree a precise time by chatting - but this speeds things up!
          </p>
          <b-row>
            <b-col class="text-center font-weight-bold">
              <p>
                Over the next 5 days, <span v-if="mine">I'm</span><span v-else>they're</span>
                available:
              </p>
              <b-table :key="showModal" striped :items="items" :fields="fields" responsive>
                <template v-slot:head()="data">
                  <!-- eslint-disable-next-line -->
                  <span v-html="data.label" />
                </template>
                <template v-slot:cell(slot)="data">
                  <span v-if="data.value === 0">
                    <b>Morning</b><br><span class="text-muted small">(8am-noon)</span>
                  </span>
                  <span v-if="data.value === 1">
                    <b>Afternoon</b><br><span class="text-muted small">(Noon-4pm)</span>
                  </span>
                  <span v-if="data.value === 2">
                    <b>Evening</b><br><span class="text-muted small">(4pm-8pm)</span>
                  </span>
                </template>
                <template v-slot:cell()="data">
                  <span v-if="data.value.other">
                    <v-icon
                      v-if="data.value.me"
                      scale="2"
                      name="check"
                      :class="'otherborder text-success ' + (mine ? 'clickme' : '')"
                      title="You are both available."
                      @click.native="toggle(data)"
                    />
                    <v-icon
                      v-else
                      name="check"
                      scale="2"
                      :class="'otherborder text-faded ' + (mine ? 'clickme' : '')"
                      title="They are available, but you're not."
                      @click.native="toggle(data)"
                    />
                  </span>
                  <span v-else>
                    <v-icon
                      v-if="data.value.me"
                      scale="2"
                      name="check"
                      :class="'text-success ' + (mine ? 'clickme' : '')"
                      title="You are available, but they aren't."
                      @click.native="toggle(data)"
                    />
                    <v-icon
                      v-else
                      name="check"
                      scale="2"
                      :class="'text-faded ' + (mine ? 'clickme' : '')"
                      title="Neither of you are available"
                      @click.native="toggle(data)"
                    />
                  </span>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <p v-if="mine">
            Click on a time slot to toggle whether you're available. If you're only available for part of a time slot
            then click it anyway - you can sort out the precise time by chat.  Click <em>Save</em> when you're done.
          </p>
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button v-if="mine" variant="white" @click="cancel">
            Cancel
          </b-button>
          <b-button v-if="!mine" variant="white" @click="cancel">
            Close
          </b-button>
          <b-button v-if="mine" variant="success" @click="save">
            <v-icon v-if="saving" name="sync" class="fa-spin" />
            <v-icon v-else name="save" />
            Save
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import 'vue-awesome/icons/check'

import dayjs from 'dayjs'

import { TablePlugin } from 'bootstrap-vue'
import Vue from 'vue'
Vue.use(TablePlugin)

// TODO DESIGN We display in slots; these don't work for everyone, but no slots will, and most people won't want to
// fill out lots of detail.  If we could work out a good UX, we would allow something which allowed the user to
// expand to fill out more detail (hours, 15 minute segments) if they wanted.  We'd need to also update the chat
// and email code which matches up when someone is available, so this is a substantial change.
// TODO ACCESSIBILITY This isn't accessible at all, is it?
export default {
  props: {
    thisuid: {
      type: Number,
      required: true
    },
    otheruid: {
      type: Number,
      required: false,
      default: null
    },
    chatid: {
      type: Number,
      required: false,
      default: null
    },
    mine: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      showModal: false,
      schedule: null,
      saving: false,
      otherSchedule: null
    }
  },
  computed: {
    fields() {
      const ret = [
        {
          key: 'slot',
          label: ''
        }
      ]

      for (let i = 0; i < 5; i++) {
        let day

        switch (i) {
          case 0:
            day = 'Today'
            break
          case 1:
            day = 'Tomorrow'
            break
          default:
            day = dayjs()
              .add(i, 'day')
              .format('dddd')
            break
        }

        const date = dayjs()
          .add(i, 'day')
          .format('Do')

        ret.push({
          key: 'day' + i,
          label:
            '<span class="small font-weight-bold">' +
            day +
            '</span><br>' +
            '<span class="small text-muted">' +
            date +
            '</span>'
        })
      }

      return ret
    },

    items() {
      const ret = []

      if (this.schedule) {
        // hour in the schedule data structure is misnamed - at the moment it runs from 0..2 and is really a slot
        // of morning/afternoon/evening.
        //
        // For b-table we need to output a row for each slot, where the columns are the availability for each day.
        for (let hour = 0; hour < 3; hour++) {
          let slot = {
            slot: hour,
            me: false,
            other: false
          }

          const row = {
            slot: hour
          }

          for (let day = 0; day < 5; day++) {
            const d = dayjs()
              .add(day, 'day')
              .set('hour', hour)
              .set('minute', 0)
              .set('second', 0)

            let available = false

            // Be careful about bad data being in there.  It's only JSON encoded on the server, and we've seen bad
            // data get in there because of bugs.  We want to ensure that we can always set it even if the data
            // is bad.
            if (
              this.schedule.schedule &&
              Array.isArray(this.schedule.schedule)
            ) {
              for (const existing of this.schedule.schedule) {
                const e = dayjs(existing.date).set('hour', existing.hour)

                if (d.unix() === e.unix()) {
                  available |= existing.available
                }
              }
            }

            slot = {
              slot: hour,
              me: available,
              other: false
            }

            if (this.otheruid) {
              let otherAvailable = false

              for (const existing of this.otherSchedule.schedule) {
                const e = dayjs(existing.date).set('hour', existing.hour)

                if (d.unix() === e.unix()) {
                  otherAvailable |= existing.available
                }
              }

              slot.other = otherAvailable
            }

            row['day' + day] = slot
          }

          ret.push(row)
        }
      }

      return ret
    }
  },
  beforeDestroy() {
    if (this.scheduleWatch) {
      this.scheduleWatch()
    }
  },
  methods: {
    async show() {
      // Fetch the current schedules before opening the modal.
      if (this.otheruid) {
        // We're going to compare our schedule to someone else's, usually in chat.
        await this.$store.dispatch('schedule/fetch', {
          userid: this.otheruid
        })

        this.otherSchedule = this.$store.getters['schedule/get']()
      }

      await this.$store.dispatch('schedule/fetch', {
        userid: this.thisuid
      })

      this.schedule = this.$store.getters['schedule/get']()

      this.showModal = true

      // Probably because of PEBCAK, I had a problem where if you brought up the modal, changed the data, cancelled, then
      // brought it up again, the old data was still present despite the fetch that happens above being called again.
      // So we jump through some hoops with a watcher and a local property.  It'll do for now.
      // The store was updated but the computed property didn't get called again.  Perhaps it's replacing the whole
      // array?  But if that was the problem then this watch wouldn't fire.
      //
      // Same code in AvailabilityModal.
      if (this.scheduleWatch) {
        this.scheduleWatch()
      }

      this.scheduleWatch = this.$store.watch(
        (state, getters) => {
          return this.$store.getters['schedule/get']()
        },
        newValue => {
          this.schedule = newValue
        }
      )
    },
    hide() {
      this.showModal = false
    },
    async save() {
      this.saving = true

      // We need to pass in the id of the other chat user if we have one.  This will cause the server to generate
      // a chat message to them saying we've updated our availability.
      await this.$store.dispatch('schedule/update', {
        ...this.schedule,
        chatuserid: this.otheruid
      })
      this.saving = false
      this.hide()

      if (this.chatid) {
        // Saving our schedule may generate a chat message, so fetch that to pick it up.
        await this.$store.dispatch('chats/fetch', {
          id: this.chatid
        })
      }
    },
    toggle(data) {
      if (this.mine) {
        const hour = data.index
        const day = data.field.key.substring(3)

        const d = dayjs()
          .add(day, 'day')
          .set('hour', hour)
          .set('minute', 0)
          .set('second', 0)

        let found = false

        if (this.schedule.schedule && Array.isArray(this.schedule.schedule)) {
          this.schedule.schedule.forEach((existing, index) => {
            const e = dayjs(existing.date).set('hour', existing.hour)

            if (d.unix() === e.unix()) {
              this.schedule.schedule[index].available = !existing.available
              found = true
            }
          })
        } else {
          this.schedule.schedule = []
        }

        if (!found) {
          this.schedule.schedule.push({
            date: dayjs()
              .add(day, 'day')
              .set('hour', 0)
              .set('minute', 0)
              .set('second', 0)
              .set('millisecond', 0),
            hour: hour,
            available: true
          })
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.otherborder {
  border-radius: 50%;
  padding: 3px;
  background-color: white;
  border: 2px solid $color-blue--light;
}
</style>
