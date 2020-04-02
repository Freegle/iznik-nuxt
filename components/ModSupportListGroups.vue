<template>
  <div>
    <SpinButton variant="success" name="users" label="Fetch Groups" spinclass="text-white" :handler="fetchGroups" />
    <div v-if="groups && groups.length" class="mt-2">
      <p>
        Here you can see info about all Freegle groups. Click on the column headings to sort.
      </p>
      <hot-table
        width="100%"
        :data="data"
        :col-headers="headers"
        license-key="non-commercial-and-evaluation"
        class="bg-white"
        :column-sorting="true"
        :dropdown-menu="true"
        :filters="true"
        :cells="cells"
        :columns="columns"
      />
    </div>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
import 'handsontable/dist/handsontable.full.css'

let HotTable

if (process.client) {
  HotTable = require('@handsontable/vue').HotTable
}

export default {
  components: {
    SpinButton,
    HotTable
  },
  data: function() {
    return {
      busy: false,
      headers: [
        'ID',
        'Short Name',
        'Display Name',
        'Last Auto-Approve',
        'Recent Auto-Approves',
        'Last on MT',
        'Active Mods',
        'Publish?',
        'FD?',
        'TN?',
        'Region',
        'Lat',
        'Lng',
        'Founded',
        'Affiliation Confirmed',
        'Backup Owners Active',
        'Backup Mods Active',
        'At Risk?'
      ],
      atts: [
        'id',
        'nameshort',
        'namedisplay',
        'lastautoapprove',
        'recentautoapproves',
        'lastmodactive',
        'activemodcount',
        'lastmoderated',
        'publish',
        'onhere',
        'ontn',
        'region',
        'lat',
        'lng',
        'founded',
        'affiliationconfirmed',
        'backupownersactive',
        'backupmodsactive',
        'atrisk'
      ],
      columns: [
        {
          type: 'numeric'
        },
        {
          type: 'text'
        },
        {
          type: 'text'
        },
        {
          type: 'date'
        },
        {
          type: 'date'
        },
        {
          type: 'date'
        },
        {
          type: 'numeric'
        },
        {
          type: 'date'
        },
        {
          type: 'checkbox'
        },
        {
          type: 'checkbox'
        },
        {
          type: 'checkbox'
        },
        {
          type: 'text'
        },
        {
          type: 'numeric'
        },
        {
          type: 'numeric'
        },
        {
          type: 'date'
        },
        {
          type: 'date'
        },
        {
          type: 'numeric'
        },
        {
          type: 'numeric'
        },
        {
          type: 'checkbox'
        }
      ]
    }
  },
  computed: {
    groups() {
      return Object.values(this.$store.getters['group/list'])
    },
    data() {
      const ret = []

      this.groups.forEach(g => {
        const thisone = []

        this.atts.forEach(a => {
          const val = g[a]

          // eslint-disable-next-line
          thisone.push(val)
        })

        ret.push(thisone)
      })

      console.log('Returning', ret)
      return ret
    }
  },
  methods: {
    async fetchGroups() {
      console.log('Fetch groups')
      await this.$store.dispatch('group/list', {
        grouptype: 'Freegle',
        support: true
      })
    },
    cells(row, col, prop) {
      return {
        editor: false
      }
    }
  }
}
</script>
<style scoped>
input {
  max-width: 300px;
}
</style>
