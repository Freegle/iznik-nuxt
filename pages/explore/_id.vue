<template>
  <div v-if="group">
    <b-card bg-light>
      <b-row v-if="group.profile">
        <b-col lg="2" class="order-0">
          <b-img rounded thumbnail alt="Community profile picture" :src="group.profile" class="js-pageimage" />
          <b-button v-if="!amAMember" class="mt-1 float-right d-lg-none float-lg-none" variant="success">
            <fa icon="plus" />&nbsp;Join
          </b-button>
          <b-button v-if="amAMember" class="mt-1 float-right d-lg-none float-lg-none" variant="white">
            <fa icon="trash-alt" />&nbsp;Leave
          </b-button>
          <b-button class="mt-1 mr-1 d-block d-lg-none float-right" variant="white">
            <div>
              <fa icon="question-circle" />&nbsp;Contact&nbsp;volunteers
            </div>
          </b-button>
        </b-col>
        <b-col class="order-3 order-lg-1">
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
          <!-- eslint-disable-next-line -->
          <span v-if="group.description" v-html="safeDescription" />
        </b-col>
        <b-col lg="2" class="order-1 order-lg-2">
          <span class="d-none d-lg-block float-right">
            <b-button class="ml-1 mb-1" variant="white">
              <div>
                <fa icon="question-circle" />&nbsp;Contact&nbsp;volunteers
              </div>
            </b-button>
            <b-button v-if="!amAMember" class="ml-1 mb-1" variant="success">
              <fa icon="plus" />&nbsp;Join
            </b-button>
            <b-button v-if="amAMember" class="ml-1 mb-1" variant="white">
              <fa icon="trash-alt" />&nbsp;Leave
            </b-button>
          </span>
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

    await store.dispatch('messages/fetch', {
      groupid: params.id
    })

    const messages = store.getters['messages/getByGroup'](params.id)

    return {
      group: group,
      messages: messages
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
