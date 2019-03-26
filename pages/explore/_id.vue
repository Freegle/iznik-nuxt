<template>
  <div v-if="group">
    <b-card bg-light>
      <b-row v-if="group.profile">
        <b-col cols="1">
          <b-img rounded thumbnail alt="Community profile picture" :src="group.profile" class="js-pageimage" />
          <b-button v-if="!amAMember" class="mt-1" variant="success">
            <fa icon="plus" />&nbsp;Join
          </b-button>
          <b-button v-if="amAMember" class="mt-1" variant="white">
            <fa icon="trash-alt" />&nbsp;Leave
          </b-button>
        </b-col>
        <b-col>
          <b-card-title>{{ group.namedisplay }}</b-card-title>
          <b-card-sub-title>{{ group.tagline }}</b-card-sub-title>
          <p class="text-muted small">
            Founded {{ group.founded | dateonly }}. {{ group.membercount.toLocaleString() }} current freeglers.
            <nuxt-link :to="{ path: '/stats/' + group.nameshort }">
              More stats
            </nuxt-link> or <nuxt-link :to="{ path: '/stories/' + group.id }">
              stories
            </nuxt-link>
          </p>
          <p v-if="!group.description">
            Give and get stuff for free with {{ group.namedisplay }}.  Offer things you don't need, and ask for things you'd like.  Don't just recycle - reuse with Freegle!
          </p>
          <p v-if="group.description">
            <span v-html="safeDescription" />
          </p>
        </b-col>
        <b-col cols="2">
          <b-button size="sm" variant="white">
            <div>
              <fa icon="question-circle" />&nbsp;Contact&nbsp;volunteers
            </div>
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import sanitizeHtml from 'sanitize-html'

export default {
  data() {
    return {
      id: null,
      group: null,
      messages: null,
      amAMember: false
    }
  },
  computed: {
    safeDescription() {
      return sanitizeHtml(this.group.description, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'p', 'a'])
      })
    }
  },
  async asyncData({ app, params, store }) {
    // We have the group id or name in params.id.  Fetch the group.
    await store.dispatch('group/fetch', {
      id: params.id
    })

    const group = store.getters['group/get'](params.id)
    console.log('Got group', group.nameshort)
    return {
      group: group
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
