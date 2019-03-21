<template>
  <b-modal
    v-if="id"
    id="edit"
    ok-title="Save"
    :title="name"
    @ok="save"
  >
    <span class="my-4">
      <b-form>
        <b-form-group label="Name:" label-for="edit-name">
          <b-form-input
            id="edit-name"
            v-model="mutableName"
            type="text"
            required
            placeholder="Enter the name"
          />
        </b-form-group>
        <b-form-group label="Comments:" label-for="edit-comments">
          <b-form-textarea
            id="edit-comments"
            v-model="mutableComments"
            placeholder="Put comments here"
            rows="10"
            class="mt-1"
          />
        </b-form-group>
      </b-form>
    </span>
  </b-modal>
</template>
<script>
export default {
  // The model is passed as input to this component via props.  We cannot mutate this.
  props: ['id', 'name', 'comments'],
  // ...so we return values based on them
  data: function() {
    console.log('Set data', this.name)
    return {
      mutableName: this.name,
      mutableComments: this.comments
    }
  },
  methods: {
    save(evt) {
      this.$store
        .dispatch('people/update', {
          id: this.id,
          name: this.mutableName,
          comments: this.mutableComments
        })
        .then(() => this.$store.dispatch('people/get'))
    }
  }
}
</script>
