<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <client-only>
          <WizardProgress :active-stage="1" class="d-none d-md-flex" />
        </client-only>
        <h1 class="text-center">
          First, what are you looking for?
        </h1>
        <ul v-for="(id, index) in ids" :key="'post-' + id" class="p-0 pt-1 list-unstyled">
          <li class="p-0">
            <b-card no-body>
              <b-card-body class="p-1">
                <PostMessage :id="id" type="Wanted" />
              </b-card-body>
              <b-card-footer v-if="index === ids.length - 1" class="d-flex justify-content-between p-0 pt-1">
                <b-btn v-if="ids.length === 1 && notblank" variant="link" size="sm" class="mr-1" @click="deleteItem">
                  <v-icon name="trash-alt" />&nbsp;Clear item
                </b-btn>
                <div>
                  <b-btn v-if="ids.length > 1" variant="link" size="sm" class="mr-1" @click="deleteItem">
                    <v-icon name="trash-alt" />&nbsp;Delete item
                  </b-btn>
                  <b-btn v-if="ids.length < 6 && valid" variant="secondary" size="sm" class="mb-1 mr-1" @click="addItem">
                    <v-icon name="plus" />&nbsp;Add another item
                  </b-btn>
                </div>
              </b-card-footer>
            </b-card>
          </li>
        </ul>
        <NoticeMessage v-if="invalid" variant="info mt-1 mb-2">
          Please add the item name, and a description or photo (or both).
        </NoticeMessage>
        <div class="mt-3">
          <div class="d-block d-md-none">
            <b-btn
              variant="primary"
              :disabled="uploadingPhoto"
              size="lg"
              block
              to="/find/whereami"
            >
              Next <v-icon name="angle-double-right" />
            </b-btn>
          </div>
          <div class="d-none d-md-flex justify-content-end">
            <b-btn
              v-if="valid"
              variant="primary"
              size="lg"
              :disabled="uploadingPhoto"
              to="/find/whereami"
            >
              Next <v-icon name="angle-double-right" />
            </b-btn>
            <NoticeMessage v-if="!valid" variant="info">
              Please add the item name, and a description or photo (or both).
            </NoticeMessage>
          </div>
        </div>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import compose from '@/mixins/compose.js'
import buildHead from '@/mixins/buildHead.js'
import NoticeMessage from '../../components/NoticeMessage'

const PostMessage = () => import('~/components/PostMessage')
const WizardProgress = () => import('~/components/WizardProgress')

export default {
  components: {
    NoticeMessage,
    PostMessage,
    WizardProgress
  },
  mixins: [loginOptional, buildHead, compose],
  data: function() {
    return {
      postType: 'Wanted',
      editLocationOrGroup: false
    }
  },
  async created() {
    // Make sure we're not wrongly set as being in the middle of an upload
    await this.$store.dispatch('compose/setUploading', false)

    if (this.me) {
      // Get our own posts so that we can spot duplicates.
      await this.$store.dispatch('messages/clear')
      this.$store.dispatch('messages/fetchMessages', {
        collection: 'AllUser',
        summary: true,
        types: ['Wanted'],
        fromuser: this.me.id,
        limit: 15
      })
    }
  },
  head() {
    return this.buildHead(
      'WANTED',
      "Ask people nearby if they have what you're looking for"
    )
  }
}
</script>
<style scoped>
.cg {
  flex-basis: 25%;
  flex-grow: 1;
}
</style>
