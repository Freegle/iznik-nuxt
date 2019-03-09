<template>
  <div>
    <b-row>
      <b-col>
        <h1>Locations</h1>
        <b-btn v-b-modal.add variant="success" class="mb-2 mt-2">
          {{ $t('locations.new') }}
        </b-btn>
        <b-table striped hover :items="list" :fields="fields">
          <template slot="actions" scope="environment">
            <a href="#" @click="setItem(environment.item)"><fa v-b-modal.delete icon="trash-alt" /></a>
            <a href="#" @click="setItem(environment.item)"><fa icon="edit" /></a>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-modal id="add" ok-title="Save" title="Add new Location" @ok="save">
      <span class="my-4">
        <b-form>
          <b-form-group label="Name:" label-for="name">
            <b-form-input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter the name"
            />
          </b-form-group>
          <b-form-group label="Number of slots:" label-for="slots">
            <b-form-input
              id="slots"
              v-model="form.slotsRequired"
              type="number"
              required
              placeholder="Enter the number of slots for this location"
            />
          </b-form-group>
        </b-form>
      </span>
    </b-modal>

    <b-modal
      v-if="item"
      id="delete"
      ok-title="Delete"
      :title="'Delete ' + item.name + '?'"
      @ok="destroy"
    >
      <p>Are you sure?</p>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      item: null,
      form: {
        name: '',
        slotsRequired: 0
      }
    }
  },
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
  async asyncData({ app, params, store }) {
    await store.dispatch('locations/get')
  },
  methods: {
    destroy() {
      this.$store
        .dispatch('locations/delete', { id: this.id })
        .then(() => this.$store.dispatch('locations/get'))
    },
    save(evt) {
      this.$store
        .dispatch('locations/create', this.form)
        .then(() => this.$store.dispatch('locations/get'))
    },
    setItem(item) {
      this.id = item.id
      this.item = item
    }
  }
}
</script>
