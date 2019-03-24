<template>
  <div>
    <!--
      We pass the person to edit down via a computed property, and trigger a re-render by setting a key on the
      id.
    -->
    <b-row class="m-0">
      <b-col>
        <h1>By Location</h1>
        <p>This shows who is working at each location in each month.  You can sort by location - click on the arrow.</p>
        <p>Click on a person to see and change their details.</p>
        <b-card class="text-center bg-light">
          <drop @drop="remove">
            <fa icon="trash-alt" />&nbsp;Drag an entry here to remove it
          </drop>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="m-0">
      <b-col>
        <b-table
          id="table"
          :busy="isBusy"
          striped
          hover
          :items="slots"
          :fields="months"
        >
          <template v-for="month in months" :slot="month" slot-scope="data">
            <div v-for="personslot in data.item.columns[month].people" :key="'1-' + month + '-' + personslot.id">
              <drag :key="'2-' + month + '-' + personslot.id" :transfer-data="personslot">
                <b-btn variant="dark" :style="backgroundColour(personslot.person)" class="mb-1" @click="edit(personslot.person)">
                  {{ personslot.person.name }}
                </b-btn>
              </drag>
            </div>
            <drop :key="'3-' + month" @drop="drop(month, data, ...arguments)">
              <b-btn variant="secondary" />
            </drop>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row class="m-0">
      <b-col>
        <b-card class="text-center bg-light">
          <drop @drop="remove">
            <fa icon="trash-alt" />&nbsp;Drag an entry here to remove it
          </drop>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="m-0">
      <b-col>
        <hr>
        <p>Here are the people. Drag them onto one of the grey boxes.</p>
        <b-list-group horizontal>
          <b-list-group-item v-for="person in people" :key="person.id">
            <drag :transfer-data="person">
              <b-button :style="backgroundColour(person)" variant="dark" @click="edit(person)">
                {{ person.name }}
              </b-button>
            </drag>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <personEdit :key="'edit' + (personToEdit ? personToEdit.id : null)" v-bind="personToEdit" />
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import personEdit from '~/components/person-edit.vue'

export default {
  middleware: 'loggedInOnly',

  components: {
    personEdit
  },

  data() {
    return {
      isBusy: false,
      editPerson: null,
      backgroundColour(person) {
        // We set the colour dynamically
        const s = {
          backgroundColor: person.colour + ' !important'
        }
        return s
      }
    }
  },

  computed: {
    months: () => [
      {
        key: 'Location',
        sortable: true
      },
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],

    people: function() {
      const people = this.$store.state.people.list
      const ret = []

      for (let i = 0; i < people.length; i++) {
        ret.push(people[i])
      }

      // Alphabetical.
      ret.sort(function(a, b) {
        return (a.name > b.name) - (a.name < b.name)
      })

      return ret
    },

    // We need to use a computed property for the edit/delete, otherwise the component won't get re-rendered when we
    // decide to operate on a new user.
    personToEdit: function() {
      return this.editPerson
    },

    slots: function() {
      // This is what we use for rendering.  We have a row per location slot.  The first column is the location name;
      // within the other cells is a list of people.
      const ret = []
      const locations = this.$store.state.locations.list
      const slots = this.$store.state.slots.list

      const people = this.$store.state.people.list
      const peopleById = []

      for (let i = 0; i < people.length; i++) {
        const person = people[i]
        peopleById[person.id] = person
      }

      // We have a row per location slot, with a minimum of one.
      for (let locationId = 0; locationId < locations.length; locationId++) {
        const location = locations[locationId]

        for (let position = 0; position < location.slotsRequired; position++) {
          const row = {
            id: locationId,
            Location: location.name + ' #' + position,
            location: location,
            position: position,
            columns: []
          }

          // First column is the location. We then have a column per month.
          for (let month = 1; month < this.months.length; month++) {
            // Now find any active slots for this location, position and month
            row.columns[this.months[month]] = {
              month: month,
              people: []
            }

            for (
              let slotScan = 0;
              slotScan < slots['hydra:totalItems'];
              slotScan++
            ) {
              const slot = cloneDeep(slots['hydra:member'][slotScan])
              const slotDate = new Date(slot.month)

              if (
                slot.position === position &&
                slotDate.getMonth() + 1 === month &&
                slot.location === '/locations/' + location.id
              ) {
                // Gotcha; add this slot to this cell, but put the person in there so we can use the name in render.
                const personId = slot.person.substring(
                  slot.person.lastIndexOf('/') + 1
                )
                slot.person = peopleById[personId]

                if (slot.person) {
                  row.columns[this.months[month]].people.push(slot)
                }
              }
            }
          }

          ret.push(row)
        }
      }

      return ret
    }
  },

  mounted() {
    // Now the page is loaded, update the store.  This way we get fast render that will pick up server changes.
    this.$store.dispatch('locations/get')
    this.$store.dispatch('people/get')
    this.$store.dispatch('slots/get')
  },

  methods: {
    canDrop(person, month) {
      // See if we can drop here.  We can't drop if there is already an entry in this month for this person.
      const slots = this.$store.state.slots.list
      let canDrop = true
      month = this.months.indexOf(month)

      for (let slotScan = 0; slotScan < slots['hydra:totalItems']; slotScan++) {
        const slot = slots['hydra:member'][slotScan]
        const slotDate = new Date(slot.month)
        const slotPerson = slot.person
          ? parseInt(slot.person.substring(slot.person.lastIndexOf('/') + 1))
          : null

        console.log('Check', slotPerson, slotDate.getMonth(), person, month)
        if (slotPerson === person.id && slotDate.getMonth() + 1 === month) {
          console.log("Can't")
          canDrop = false
        }
      }

      return canDrop
    },

    drop(month, data, dropped) {
      console.log('Drop', arguments)
      const location = data.item.location
      const position = data.item.position

      // Set to midday to avoid saving time issues.
      this.isBusy = true
      const date = new Date(
        new Date().getFullYear(),
        this.months.indexOf(month) - 1,
        1,
        12,
        0
      )

      if (dropped.hasOwnProperty('person')) {
        // We are moving a slot.
        const person = dropped.person

        if (this.canDrop(person, month)) {
          this.$store.dispatch('slots/delete', dropped).then(() => {
            const params = {
              location: '/locations/' + location.id,
              person: '/people/' + person.id,
              position: position,
              month: date.toISOString()
            }

            console.log('Params', params)
            this.$store
              .dispatch('slots/create', params)
              .then(() => this.$store.dispatch('slots/get'))
              .then(() => (this.isBusy = false))
          })
        } else {
          this.isBusy = false
        }
      } else {
        // We are adding a slot.
        const person = dropped

        if (this.canDrop(person, month)) {
          const params = {
            location: '/locations/' + location.id,
            person: '/people/' + person.id,
            position: position,
            month: date.toISOString()
          }

          console.log('Params', params)
          this.$store
            .dispatch('slots/create', params)
            .then(() => this.$store.dispatch('slots/get'))
            .then(() => (this.isBusy = false))
        } else {
          this.isBusy = false
        }
      }
    },

    remove(slot) {
      this.$store
        .dispatch('slots/delete', slot)
        .then(() => this.$store.dispatch('slots/get'))
    },

    edit(person) {
      console.log('Edit', person)
      this.editPerson = person
    }
  }
}
</script>
<style>
.btn-secondary {
  opacity: 0.2;
}

.btn {
  width: 100px !important;
  height: 37.61px !important;
}
</style>
