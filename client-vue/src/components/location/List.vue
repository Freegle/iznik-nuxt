<template>
  <div>
    <h1>Location List</h1>

    <router-link
      :to="{ name: 'LocationCreate' }"
      class="btn btn-primary">Create a location</router-link>

    <div
      v-if="isLoading"
      class="alert alert-info mt-2">Loading...</div>
    <div
      v-if="deletedItem"
      class="alert alert-success">{{ deletedItem['@id'] }} deleted.</div>
    <div
      v-if="error"
      class="alert alert-danger">{{ error }}</div>

    <span v-if="view">
      <button
        :disabled="!view['hydra:previous']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:first'])">First</button>
      &nbsp;
      <button
        :disabled="!view['hydra:previous']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:previous'])">Previous</button>
      &nbsp;
      <button
        :disabled="!view['hydra:next']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:next'])">Next</button>
      &nbsp;
      <button
        :disabled="!view['hydra:last']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:last'])">Last</button>
      &nbsp;
    </span>

    <div class="table-responsive mt-2">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slots Required</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item['@id']">
            <td>
              <router-link
                v-if="item"
                :to="{name: 'LocationShow', params: { id: item['@id'] }}">
                {{ item['name'] }}
              </router-link>
            </td>
            <td>
              <router-link
                v-if="item"
                :to="{name: 'LocationShow', params: { id: item['@id'] }}">
                {{ item['slotsRequired'] }}
              </router-link>
            </td>
            <td>
              <router-link :to="{name: 'LocationUpdate', params: { id: item['@id'] }}">
                <font-awesome-icon aria-hidden="true" icon="edit" />
                <span class="sr-only">Edit</span>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    deletedItem: 'location/del/deleted',
    error: 'location/list/error',
    items: 'location/list/items',
    isLoading: 'location/list/isLoading',
    view: 'location/list/view'
  }),

  created () {
    this.getPage()
  },

  methods: mapActions({
    getPage: 'location/list/default'
  })
}
</script>
