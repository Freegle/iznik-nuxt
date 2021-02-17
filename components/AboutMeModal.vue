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
            <strong>No need to say what you're giving/seeking. </strong>This is just to introduce yourself to other people, if
            you want to.  If you want to talk to someone specific, use the <em>Message</em> link on their profile.
          </p>
          <b-form-textarea
            v-model="text"
            placeholder="Tell us a bit about yourself!"
            rows="8"
          />
          <notice-message variant="info" class="mt-1">
            <v-icon name="globe-europe" /> Other freeglers will see what you put here, in your profile and on ChitChat.  That's the point!
          </notice-message>
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button variant="white" @click="cancel">
            Cancel
          </b-button>
          <b-button variant="primary" @click="save">
            Save
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  mixins: [modal],
  data: function() {
    return {
      text: null
    }
  },
  methods: {
    show() {
      this.text =
        this.me && this.me.aboutme && this.me.aboutme.text
          ? this.me.aboutme.text
          : null
      this.showModal = true
    },
    async save() {
      await this.$store.dispatch('auth/saveAboutMe', this.text)
      this.$emit('datachange')
      this.hide()
    }
  }
}
</script>
