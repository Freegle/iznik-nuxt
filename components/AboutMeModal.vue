<template>
  <div>
    <client-only>
      <b-modal
        id="aboutmemodal"
        v-model="showModal"
        :title="!review ? 'Why not complete your public profile?' : 'Please review your public profile'"
        size="lg"
        no-stacking
      >
        <template slot="default">
          <notice-message v-if="review" type="info">
            You added this a while ago - can you just check it still applies?  If it does, just click <em>Cancel</em>.
            If you want to change it, edit it and click <em>Save</em>.
          </notice-message>
          <p>
            It's nice to know a bit about other freeglers.  We're not a dating site but it makes freegling more fun
            and helps get a better response when you're replying to OFFERs.
          </p>
          <p>
            <strong>Don't put anything private in here.</strong>
            It's public, and it's what everyone on Freegle will see about you.  We'll post it
            on <em>ChitChat</em> as a way to say hello to everyone, too.
          </p>
          <p>
            It's up to you what you say - why you freegle, general arrangements for collection, hobbies.
            It'll be visible until you change it in <em>Settings</em>, so write something that'll still make
            sense in a few months time!
          </p>
          <p>
            If you don't want to do this, that's fine - just click <em>Cancel</em>.
          </p>
          <b-form-textarea
            v-model="text"
            placeholder="Tell us a bit about yourself!"
            rows="8"
          />
          <notice-message variant="info" class="mt-2">
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
  props: {
    review: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      text: null
    }
  },
  methods: {
    async show() {
      await this.fetchMe(['me', 'aboutme'])

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
