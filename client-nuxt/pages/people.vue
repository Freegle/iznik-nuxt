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
            <a href="#" class="mr-2" @click="destroy(environment.item)"><fa v-b-modal.delete size="lg" icon="trash-alt" /></a>
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


    <!--
    We pass the person to edit down via a computed property, and trigger a re-render by setting a key on the
    id.
    -->
    <personDelete :key="'del' + (personToDelete ? personToDelete.id : null)" v-bind="personToDelete" />
    <personEdit :key="'edit' + (personToEdit ? personToEdit.id : null)" v-bind="personToEdit" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import personEdit from '~/components/person-edit.vue'
import personDelete from '~/components/person-delete.vue'

export default {
  middleware: 'loggedInOnly',

  components: {
    personEdit,
    personDelete
  },

  data() {
    return {
      form: {
        name: '',
        comments: ''
      },
      editPerson: null,
      deletePerson: null
    }
  },
  computed: {
    ...mapState({
      list: state => {
        return state.people.list
      },
      // We need to use a computed property for the edit/delete, otherwise the component won't get re-rendered when we
      // decide to operate on a new user.
      personToEdit: function() {
        return this.editPerson
      },
      personToDelete: function() {
        console.log('personToDelete', this.deletePerson)
        return this.deletePerson
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
    create(evt) {
      this.$store
        .dispatch('people/create', this.form)
        .then(() => this.$store.dispatch('people/get'))
    },
    edit(person) {
      this.editPerson = person
    },
    destroy(person) {
      console.log('Delete', person)
      this.deletePerson = person
    }
  }
}
</script>
