<template>
  <b-row>
    <b-col>
      <h1>Locations</h1>
      <b-btn variant="success" class="mb-2 mt-2" :to="'/locations/new'">
        {{ $t('locations.new') }}
      </b-btn>
      <b-table striped hover :items="list" :fields="fields">
        <template slot="actions">
          <fa icon="trash-alt" />
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      list: state => {
        return state.locations.list
      }
    }),
    fields: () => [
      {
        key: 'name',
        label: 'Location'
      },
      {
        key: 'slotsRequired',
        label: 'People Required'
      },
      {
        key: 'actions',
        label: 'Actions'
      }
    ]
  },
  async fetch({ store }) {
    await store.dispatch('locations/get')
  },
  methods: {
    destroy() {
      this.$store
        .dispatch('locations/delete', { id: this.id })
        .then(() => this.$store.dispatch('locations/get'))
    }
  }
}
</script>
