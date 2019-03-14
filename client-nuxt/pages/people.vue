<template>
  <div>
    <b-row>
      <b-col>
        <h1>People</h1>
        <b-btn v-b-modal.add variant="success" class="mb-2 mt-2">
          {{ $t('people.new') }}
        </b-btn>
        <b-table striped hover :items="list" :fields="fields">
          <template slot="actions" scope="environment">
            <a href="#" class="mr-2" @click="setItem(environment.item)"><fa v-b-modal.delete size="lg" icon="trash-alt" /></a>
            <a href="#" class="mr-2" @click="setItem(environment.item)"><fa v-b-modal.edit size="lg" icon="edit" /></a>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-modal id="add" ok-title="Save" title="Add new Person" @ok="create">
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
        </b-form>
      </span>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'

export default {
  data() {
    return {
      item: null,
      form: {
        name: ''
      }
    }
  },
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
      },
      {
        key: 'actions',
        label: 'Actions'
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
    },
    create(evt) {
      this.$store
        .dispatch('people/create', this.form)
        .then(() => this.$store.dispatch('people/get'))
    },
    setItem(item) {
      this.id = item.id

      // We have to cloneDeep to avoid mutating the store.
      this.item = cloneDeep(item)
    },
    save(evt) {
      this.$store
        .dispatch('people/update', this.item)
        .then(() => this.$store.dispatch('people/get'))
    }
  }
}
</script>
