<template>
  <div>
    <client-only>
      <b-modal
        id="aboutmemodal"
        v-model="showModal"
        title="Why not tell other freeglers a bit about yourself?"
        alt="Why not tell other freeglers a bit about yourself?"
        size="lg"
        no-stacking
      >
        <template slot="default">
          <p>
            It's nice to know a bit about other freeglers.  We're not a dating site but it makes freegling more fun
            and helps get a better response when you're replying to OFFERs.
          </p>
          <p>
            <b>No need to say what you're giving/seeking. </b>This is just to introduce yourself to other people.
          </p>
          <b-form-textarea
            v-model="text"
            placeholder="Tell us a bit about yourself!"
            rows="8"
          />
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button variant="white" @click="cancel">
            Cancel
          </b-button>
          <b-button variant="success" @click="save">
            Save
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      showModal: false,
      text: null
    }
  },
  methods: {
    async show() {
      // Fetch the current value, if any, before opening the modal.
      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups', 'aboutme']
      })
      const me = this.$store.state.auth.user
      this.text = me.aboutme.text ? me.aboutme.text : null
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async save() {
      await this.$store.dispatch('auth/saveAboutMe', this.text)
      this.$emit('change')
      this.hide()
    }
  }
}
</script>
