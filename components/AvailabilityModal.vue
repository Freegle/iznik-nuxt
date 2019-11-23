<template>
  <div>
    <client-only>
      <b-modal
        id="availabilitymodal"
        v-model="showModal"
        title="When are you available?"
        alt="When are you available?"
        size="lg"
        no-stacking
      >
        <template slot="default">
          <p>
            We can help you arrange a collection time. If you want to, <b>tell us when you're available</b> in the next few days.
            You don't have to do this, and you can still agree a precise time by chatting - but this speeds things up!
          </p>
          <b-row>
            <b-col class="text-center font-weight-bold">
              <p>Over the next 5 days, I'm available:</p>
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
                  <v-icon v-if="data.value" scale="2" name="check" class="text-success clickme" @click.native="toggle(data)" />
                  <v-icon v-else name="check" scale="2" class="text-faded clickme" @click.native="toggle(data)" />
                </template>
              </b-table>
            </b-col>
          </b-row>
          <p>
            Click on a time slot to toggle whether you're available. If you're only available for part of a time slot
            then click it anyway - you can sort out the precise time by chat.  Click <em>Save</em> when you're done.
          </p>
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button variant="white" @click="cancel">
            Cancel
          </b-button>
          <b-button variant="success" @click="save">
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
import dayjs from 'dayjs'

// TODO Don't ask again function.
// TODO DESIGN We display in slots; these don't work for everyone, but no slots will, and most people won't want to
// fill out lots of detail.  If we could work out a good UX, we would allow something which allowed the user to
// expand to fill out more detail (hours, 15 minute segments) if they wanted.  We'd need to also update the chat
// and email code which matches up when someone is available, so this is a substantial change.
// TODO ACCESSIBILITY This isn't accessible at all, is it?
export default {
  data: function() {
    return {
      showModal: false,
      schedule: null,
      saving: false
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

      console.log('Compute items from', this.schedule)

      if (this.schedule) {
        // hour in the schedule data structure is misnamed - at the moment it runs from 0..2 and is really a slot
        // of morning/afternoon/evening.

        for (let hour = 0; hour < 3; hour++) {
          const slot = {
            slot: hour
          }

          for (let day = 0; day < 5; day++) {
            const d = dayjs()
              .add(day, 'day')
              .set('hour', hour)
              .set('minute', 0)
              .set('second', 0)

            let available = false

            for (const existing of this.schedule.schedule) {
              const e = dayjs(existing.date).set('hour', existing.hour)

              if (d.unix() === e.unix()) {
                available |= existing.available
              }
            }

            slot['day' + day] = available
          }

          ret.push(slot)
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
      // Fetch the current value, if any, before opening the modal.
      await this.$store.dispatch('schedule/fetch')
      this.schedule = this.$store.getters['schedule/get']()
      this.showModal = true

      // Probably because of PEBCAK, I had a problem where if you brought up the modal, changed the data, cancelled, then
      // brought it up again, the old data was still present despite the fetch that happens above being called again.
      // So we jump through some hoops with a watcher and a local property.  It'll do for now.
      // The store was updated but the computed property didn't get called again.  Perhaps it's replacing the whole
      // array?  But if that was the problem then this watch wouldn't fire.
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
      await this.$store.dispatch('schedule/update', this.schedule)
      this.saving = false
      this.hide()
    },
    toggle(data) {
      const hour = data.index
      const day = data.field.key.substring(3)

      const d = dayjs()
        .add(day, 'day')
        .set('hour', hour)
        .set('minute', 0)
        .set('second', 0)

      let found = false

      this.schedule.schedule.forEach((existing, index) => {
        const e = dayjs(existing.date).set('hour', existing.hour)

        if (d.unix() === e.unix()) {
          this.schedule.schedule[index].available = !existing.available
          found = true
        }
      })

      if (!found) {
        this.schedule.schedule.push({
          data: dayjs()
            .add(day, day)
            .set('hour', 0)
            .set('minute', 0)
            .set('second.0'),
          hour: hour,
          available: true
        })
      }
    }
  }
}
</script>
