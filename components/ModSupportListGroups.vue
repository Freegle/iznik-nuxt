<template>
  <div>
    <SpinButton variant="success" name="users" label="Fetch Groups" spinclass="text-white" :handler="fetchGroups" />
    <div v-if="fetched && groups && groups.length" class="mt-2">
      <p>
        Here you can see info about all Freegle groups. Click on the column headings to sort.  Click on the dropdown
        arrow to filter.
      </p>
      <hot-table
        ref="hot"
        width="100%"
        height="600px"
        :data="groups"
        :col-headers="headers"
        license-key="non-commercial-and-evaluation"
        class="bg-white"
        :column-sorting="true"
        :dropdown-menu="true"
        :filters="true"
        :cells="cells"
        :columns="columns"
        :manual-column-freeze="true"
        :after-render="afterRender"
      />
    </div>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
import 'handsontable/dist/handsontable.full.css'

let HotTable, Handsontable

if (process.client) {
  HotTable = require('@handsontable/vue').HotTable
  Handsontable = require('handsontable').default
}

export default {
  components: {
    SpinButton,
    HotTable
  },
  data: function() {
    return {
      busy: false,
      fetched: false,
      headers: [
        'ID',
        'Short Name',
        'Display Name',
        'Last Auto-Approve',
        'Recent Auto-Approves',
        'Active Mods',
        'Last Moderated',
        'Last on MT',
        'Publish?',
        'FD?',
        'TN?',
        'Region',
        'Lat',
        'Lng',
        'Founded',
        'Affiliation Confirmed',
        'Backup Owners Active',
        'Backup Mods Active'
      ],
      atts: [],
      columns: [
        {
          data: 'id',
          type: 'numeric'
        },
        {
          data: 'nameshort',
          type: 'text'
        },
        {
          data: 'namedisplay',
          type: 'text'
        },
        {
          data: 'lastautoapprove',
          type: 'date',
          renderer: this.forceDate
        },
        {
          data: 'recentautoapproves',
          type: 'numeric',
          renderer: this.numberDash
        },
        {
          data: 'activemodcount',
          type: 'numeric',
          renderer: this.forceNumeric
        },
        {
          data: 'lastmoderated',
          type: 'date',
          renderer: this.forceDate
        },
        {
          data: 'lastmodactive',
          type: 'date',
          renderer: this.forceDate
        },
        {
          data: 'publish',
          type: 'checkbox',
          renderer: this.forceBool
        },
        {
          data: 'onhere',
          type: 'checkbox',
          renderer: this.forceBool
        },
        {
          data: 'ontn',
          type: 'checkbox',
          renderer: this.forceBool
        },
        {
          data: 'region',
          type: 'text'
        },
        {
          data: 'lat',
          type: 'numeric',
          renderer: this.latLng
        },
        {
          data: 'lng',
          type: 'numeric',
          renderer: this.latLng
        },
        {
          data: 'founded',
          type: 'date',
          renderer: this.forceDate
        },
        {
          data: 'affiliationconfirmed',
          type: 'date',
          renderer: this.forceDate
        },
        {
          data: 'backupownersactive',
          type: 'numeric',
          renderer: this.forceNumeric
        },
        {
          data: 'backupmodsactive',
          type: 'numeric',
          renderer: this.forceNumeric
        }
      ]
    }
  },
  computed: {
    groups() {
      return Object.values(this.$store.getters['group/list'])
    }
  },
  methods: {
    async fetchGroups() {
      await this.$store.dispatch('group/list', {
        grouptype: 'Freegle',
        support: true
      })

      // This prevents us rendering partial data that happens to be in store.
      this.fetched = true
    },
    cells(row, col, prop) {
      return {
        editor: false
      }
    },
    forceBool(hotInstance, td, row, column, prop, value, cellProperties) {
      Handsontable.renderers.CheckboxRenderer.call(
        this,
        hotInstance,
        td,
        row,
        column,
        prop,
        Boolean(parseInt(value)),
        cellProperties
      )
    },
    forceNumeric(hotInstance, td, row, column, prop, value, cellProperties) {
      Handsontable.renderers.NumericRenderer.call(
        this,
        hotInstance,
        td,
        row,
        column,
        prop,
        parseInt(value),
        cellProperties
      )
    },
    forceDate(hotInstance, td, row, column, prop, value, cellProperties) {
      let val = '-'
      td.style.textAlign = 'right'

      if (value) {
        val = this.$dayjs(value).format('YYYY-MM-DD')
      }

      Handsontable.renderers.TextRenderer.call(
        this,
        hotInstance,
        td,
        row,
        column,
        prop,
        val,
        cellProperties
      )
    },
    numberDash(hotInstance, td, row, column, prop, value, cellProperties) {
      const val = parseInt(value)

      if (val) {
        Handsontable.renderers.NumericRenderer.call(
          this,
          hotInstance,
          td,
          row,
          column,
          prop,
          val,
          cellProperties
        )
      } else {
        td.style.textAlign = 'right'
        Handsontable.renderers.TextRenderer.call(
          this,
          hotInstance,
          td,
          row,
          column,
          prop,
          '-',
          cellProperties
        )
      }
    },
    latLng(hotInstance, td, row, column, prop, value, cellProperties) {
      Handsontable.renderers.NumericRenderer.call(
        this,
        hotInstance,
        td,
        row,
        column,
        prop,
        Math.round(parseFloat(value) * 100) / 100,
        cellProperties
      )
    },
    afterRender() {
      const inst = this.$refs.hot.hotInstance

      // Freeze the name
      const plugin = inst.getPlugin('ManualColumnFreeze')
      plugin.freezeColumn(1)
    }
  }
}
</script>
<style scoped>
input {
  max-width: 300px;
}
</style>
