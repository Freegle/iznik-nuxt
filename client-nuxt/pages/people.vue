<template>
  <b-row>
    <b-col>
      <h1>People</h1>
      <b-btn variant="success" class="mb-2 mt-2" :to="'/people/new'">
        {{ $t('people.new') }}
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
        return state.people.list
      }
    }),
    fields: () => [
      {
        key: 'name',
        label: 'Person'
      }
    ]
  },
  async fetch({ store }) {
    await store.dispatch('people/get')
  },
  methods: {
    destroy() {
      this.$store
        .dispatch('people/delete', { id: this.id })
        .then(() => this.$store.dispatch('people/get'))
    }
  }
}
</script>
