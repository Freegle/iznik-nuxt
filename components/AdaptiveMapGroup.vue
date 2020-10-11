<template>
  <div v-if="group.onmap">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <GroupProfileImage :image="group.profile ? group.profile : '/icon.png'" :alt-text="'Profile picture for ' + group.namedisplay" class="ml-0 ml-md-2 mr-2" />
        </div>
      </div>
      <div class="media-body">
        <div v-if="group.external">
          <ExternalLink :href="group.external">
            <b-btn variant="primary" class="float-right mr-2">
              Explore
            </b-btn>
            {{ group.namedisplay }}
          </ExternalLink>
        </div>
        <div v-else>
          <b-btn variant="primary" class="float-right mr-2" :to="'/explore/' + group.nameshort">
            Explore
          </b-btn>
          <nuxt-link :to="'/explore/' + group.nameshort">
            {{ group.namedisplay }}
          </nuxt-link>
        </div>
        <div v-if="group.tagline">
          {{ group.tagline }}
        </div>
        <br v-else>
        <span v-if="!group.external" class="text-muted">
          <ExternalLink :href="'mailto:' + group.modsmail"><v-icon name="envelope" title="Contact volunteers" /></ExternalLink>
        </span>
        <span v-else-if="group.contactmail">
          <ExternalLink :href="'mailto:' + group.contactmail"><v-icon name="envelope" title="Contact volunteers" /></ExternalLink>
        </span>
      </div>
    </div>
    <hr class="text-muted">
  </div>
</template>
<script>
import ExternalLink from './ExternalLink'
import GroupProfileImage from './GroupProfileImage'

export default {
  components: { GroupProfileImage, ExternalLink },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.id)
    }
  }
}
</script>
