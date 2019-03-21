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
            <a href="#" class="mr-2" @click="edit(environment.item)"><fa v-b-modal.edit size="lg" icon="edit" /></a>
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
              placeholder="Enter their name"
            />
          </b-form-group>
          <b-form-group label="Comments:" label-for="add-comments">
            <b-form-textarea
              id="add-comments"
              v-model="form.comments"
              placeholder="Put comments here"
              rows="10"
              class="mt-1"
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

    <personModal :key="personToEdit.id" v-bind="personToEdit" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import personModal from '~/components/person-modal.vue'

export default {
  middleware: 'loggedInOnly',

  components: {
    personModal
  },

  data() {
    return {
      item: null,
      form: {
        name: '',
        comments: ''
      },
      editPerson: null
    }
  },
  computed: {
    ...mapState({
      list: state => {
        return state.people.list
      },
      personToEdit: function() {
        console.log('personToEdit', this.editPerson)
        return this.editPerson
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
  mounted() {
    // Now the page is loaded, update the store.  This way we get fast render that will pick up server changes.
    this.$store.dispatch('people/get')
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
    edit(person) {
      // We have to cloneDeep to avoid mutating the store.
      this.editPerson = cloneDeep(person)
      console.log('Edit', this.personToEdit.id)
    },
    setItem(item) {
      this.id = item.id

      // We have to cloneDeep to avoid mutating the store.
      this.item = cloneDeep(item)
      console.log('Set item')
    }
  }
}
</script>
