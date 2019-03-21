<template>
  <div>
    <b-row class="m-0">
      <b-col>
        <h1>By Person</h1>
        <p>
          This shows where each person is working in each month.  You can't move things on here (do we need to?).  You
          can sort by person - click on the arrow.
        </p>
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
            <b-btn v-if="data.item.columns[month].location" :key="month" variant="info">
              {{ data.item.columns[month].location.name }}
            </b-btn>
            <drop v-if="!data.item.columns[month].location" :key="month">
              <b-btn variant="secondary" />
            </drop>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  middleware: 'loggedInOnly',

  data() {
    return {
      isBusy: false
    }
  },

  computed: {
    months: () => [
      {
        key: 'Person',
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
      // This is what we use for rendering.  We have a row per person.  The first column is the person name;
      // within the other cells is the location where they are working.
      const ret = []
      const locations = this.$store.state.locations.list
      const slots = this.$store.state.slots.list

      const people = this.$store.state.people.list
      const locationsById = []

      for (let i = 0; i < locations.length; i++) {
        const location = locations[i]
        locationsById[location.id] = location
      }

      for (let personId = 0; personId < people.length; personId++) {
        const person = people[personId]

        const row = {
          id: personId,
          Person: person.name,
          person: person,
          columns: []
        }

        // First column is the person. We then have a column per month.
        for (let month = 1; month < this.months.length; month++) {
          // Now find any active slots for this person and month
          row.columns[this.months[month]] = {
            month: month,
            location: null
          }

          for (
            let slotScan = 0;
            slotScan < slots['hydra:totalItems'];
            slotScan++
          ) {
            const slot = slots['hydra:member'][slotScan]
            const slotDate = new Date(slot.month)

            if (
              slotDate.getMonth() + 1 === month &&
              slot.person === '/people/' + person.id
            ) {
              // Gotcha; add this slot to this cell, but put the location in there so we can use the name in render.
              const locationId = slot.location.substring(
                slot.location.lastIndexOf('/') + 1
              )
              row.columns[this.months[month]].location =
                locationsById[locationId]
              console.log('Gotcha', slot)
            }
          }
        }

        ret.push(row)
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
  methods: {}
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
