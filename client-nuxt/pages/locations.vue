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
            <a href="#" class="mr-2" @click="setItem(environment.item)"><fa v-b-modal.delete size="lg" icon="trash-alt" /></a>
            <a href="#" class="mr-2" @click="setItem(environment.item)"><fa v-b-modal.edit size="lg" icon="edit" /></a>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-modal id="add" ok-title="Save" title="Add new Location" @ok="create">
      <span class="my-4">
        <b-form>
          <b-form-group label="Name:" label-for="add-name">
            <b-form-input
              id="add-name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter the name"
            />
          </b-form-group>
          <b-form-group label="People required:" label-for="add-slots">
            <b-form-input
              id="add-slots"
              v-model="form.slotsRequired"
              type="number"
              min="1"
              required
              placeholder="Enter the number of people required for this location"
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

    <b-modal
      v-if="item"
      id="edit"
      ok-title="Save"
      :title="'Edit ' + item.name"
      @ok="save"
    >
      <span class="my-4">
        <b-form>
          <b-form-group label="Name:" label-for="edit-name">
            <b-form-input
              id="edit-name"
              v-model="item.name"
              type="text"
              required
              placeholder="Enter the name"
            />
          </b-form-group>
          <b-form-group label="People required:" label-for="edit-slots">
            <b-form-input
              id="edit-slots"
              v-model.number="item.slotsRequired"
              type="number"
              min="1"
              required
              placeholder="Enter the number of people required for this location"
            />
          </b-form-group>
        </b-form>
      </span>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
  middleware: 'loggedInOnly',

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
        label: 'Location',
        sortable: true
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
  mounted() {
    // Now the page is loaded, update the store.  This way we get fast render that will pick up server changes.
    this.$store.dispatch('locations/get')
  },
  methods: {
    destroy() {
      this.$store
        .dispatch('locations/delete', { id: this.id })
        .then(() => this.$store.dispatch('locations/get'))
    },
    create(evt) {
      this.$store
        .dispatch('locations/create', this.form)
        .then(() => this.$store.dispatch('locations/get'))
    },
    setItem(item) {
      this.id = item.id

      // We have to cloneDeep to avoid mutating the store.
      this.item = cloneDeep(item)
    },
    save(evt) {
      this.$store
        .dispatch('locations/update', this.item)
        .then(() => this.$store.dispatch('locations/get'))
    }
  }
}
</script>
