<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <WizardProgress :active-stage="2" />
        <h1 class="text-center">
          So, what are you looking for?
        </h1>
        <ul v-for="(id, index) in ids" :key="'post-' + id" class="p-0 pt-1 list-unstyled">
          <li class="p-0">
            <b-card no-body>
              <b-card-body class="pt-0 pb-1">
                <PostMessage :id="id" type="Wanted" />
              </b-card-body>
              <b-card-footer v-if="index === ids.length - 1" class="d-flex justify-content-between p-0 pt-1">
                <Postcode
                  :find="false"
                  size="md"
                  class="d-inline"
                  :value="postcode ? postcode.name : null"
                  @selected="postcodeSelect"
                />
                <ComposeGroup class="cg" />
              </b-card-footer>
            </b-card>
          </li>
        </ul>
        <div class="d-flex justify-content-between ml-1 mr-1">
          <b-btn v-if="ids.length === 1 && notblank" variant="white" size="sm" class="mr-1" @click="deleteItem">
            <v-icon name="trash-alt" />&nbsp;Clear item
          </b-btn>
          <b-btn v-if="ids.length > 1" variant="white" size="sm" class="mr-1" @click="deleteItem">
            <v-icon name="trash-alt" />&nbsp;Delete item
          </b-btn>
          <b-btn v-if="ids.length < 6" variant="secondary" size="sm" class="" @click="addItem">
            <v-icon name="plus" />&nbsp;Add another item
          </b-btn>
        </div>
        <div class="mt-3">
          <div class="d-block d-md-none">
            <b-btn
              v-if="valid"
              variant="primary"
              :disabled="uploadingPhoto"
              size="lg"
              block
              @click="next"
            >
              Next <v-icon name="angle-double-right" />
            </b-btn>
            <NoticeMessage v-if="!valid" variant="info">
              Please add the item name, and a description or photo (or both).
            </NoticeMessage>
          </div>
          <div class="d-none d-md-flex justify-content-between">
            <b-btn variant="white" size="lg" to="/find" class="d-none d-md-block">
              <v-icon name="angle-double-left" /> Back
            </b-btn>
            <b-btn
              v-if="valid"
              variant="primary"
              size="lg"
              :disabled="uploadingPhoto"
              @click="next"
            >
              Next <v-icon name="angle-double-right" />
            </b-btn>
            <NoticeMessage v-if="!valid" variant="info">
              Please add the item name, and a description or photo (or both).
            </NoticeMessage>
          </div>
        </div>
        <CovidPostWarning class="mt-2 mb-2" />
        <div class="text-muted small pl-0 pt-1 text-center">
          We may show this post, but not your email address, to people who are not yet members of Freegle.
          This helps the community grow by showing people what's happening and encouraging them to join.
        </div>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>
<script>
import NoticeMessage from '../../components/NoticeMessage'
import CovidPostWarning from '../../components/CovidPostWarning'
import loginOptional from '@/mixins/loginOptional.js'
import compose from '@/mixins/compose.js'
import buildHead from '@/mixins/buildHead.js'

const PostMessage = () => import('~/components/PostMessage')
const Postcode = () => import('~/components/Postcode')
const ComposeGroup = () => import('~/components/ComposeGroup')
const WizardProgress = () => import('~/components/WizardProgress')

export default {
  components: {
    CovidPostWarning,
    NoticeMessage,
    PostMessage,
    Postcode,
    ComposeGroup,
    WizardProgress
  },
  mixins: [loginOptional, buildHead, compose],
  data: function() {
    return {
      postType: 'Wanted'
    }
  },
  methods: {
    next() {
      const currentpc = this.$store.getters['compose/getPostcode']

      if (currentpc) {
        // We shouldn't be able to progress if we didn't have a postcode.
        this.$router.push('/find/whoami')
      }
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
