<template>
  <div>
    <b-row>
      <b-col>
        <h1>By Location</h1>
        <p>This shows who is working at each location in each month.</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table id="table" striped hover :items="slots" :fields="columns">
          <template v-for="month in columns" :slot="month" slot-scope="data">
            <drop :key="data.item.id + '-' + data.item.Location + '-' + month" @drop="drop(month, data, ...arguments)">
              <b-btn v-if="data.item[month].person" variant="info">
                {{ data.item[month].person.name }}
              </b-btn>
              <b-btn v-if="!data.item[month].person" variant="secondary" />
            </drop>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <hr>
        <p>Here are the people.  Drag them into a cell.</p>
        <b-list-group horizontal>
          <b-list-group-item v-for="person in people" :key="person.id">
            <drag :transfer-data="person">
              <b-button variant="info">
                {{ person.name }}
              </b-button>
            </drag>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  middleware: 'loggedInOnly',

  data() {
    return {}
  },

  computed: {
    columns: () => [
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

    slots: function() {
      const locations = this.$store.state.locations.list
      const locsById = []
      const taken = []

      for (let i = 0; i < locations.length; i++) {
        const location = locations[i]
        locsById[location.id] = location
      }

      const people = this.$store.state.people.list
      const peopleById = []

      for (let i = 0; i < people.length; i++) {
        const person = people[i]
        peopleById[person.id] = person
      }

      const ret = []
      const slots = this.$store.state.slots.list

      // We have a row per location slot
      for (let locationId = 0; locationId < locations.length; locationId++) {
        const location = locations[locationId]

        for (
          let slotRequired = 0;
          slotRequired < location.slotsRequired;
          slotRequired++
        ) {
          // First column is the location
          const row = {
            id: locationId,
            Location: location.name + ' #' + slotRequired
          }

          // We have a cell per month.
          for (let month = 1; month < this.columns.length; month++) {
            // Now find any active slots for this location and month
            row[this.columns[month]] = {
              id: slotRequired * 12 + month,
              person: null
            }

            for (
              let slotScan = 0;
              slotScan < slots['hydra:totalItems'];
              slotScan++
            ) {
              const slot = slots['hydra:member'][slotScan]

              // We only want a slot to appear once in the display
              if (!taken.hasOwnProperty(slot.id) && slot.person) {
                const slotDate = new Date(slot.month)

                if (slotDate.getMonth() + 1 === month) {
                  if (slot.location === '/locations/' + location.id) {
                    console.log(slot.id, this.columns[month], locationId)
                    const personId = slot.person.substring(
                      slot.person.lastIndexOf('/') + 1
                    )

                    row[this.columns[month]].person = peopleById[personId]

                    console.log('Record taken slot', slot.id)
                    taken[slot.id] = true
                    break
                  }
                }
              }
            }
          }

          ret.push(row)
        }
      }

      console.log('Grid', ret)
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
    drop(month, data, dropped) {
      console.log('Month', month)
      console.log('Data', data)

      const locations = this.$store.state.locations.list
      let locid = null

      for (let i = 0; i < locations.length; i++) {
        const locName = data.item.Location.substring(
          0,
          data.item.Location.indexOf('#') - 1
        )
        console.log('Compare loc', locations[i].name, locName)
        if (locations[i].name === locName) {
          locid = locations[i].id
        }
      }

      const person = dropped
      console.log('Person', person)

      // Set to midday to avoid saving time issues.
      const date = new Date(
        new Date().getFullYear(),
        this.columns.indexOf(month) - 1,
        1,
        12,
        0
      )
      console.log('DAte', date)

      const params = {
        location: '/locations/' + locid,
        person: '/people/' + person.id,
        month: date.toISOString()
      }

      console.log('Params', params)
      this.$store
        .dispatch('slots/create', params)
        .then(() => this.$store.dispatch('slots/get'))
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
