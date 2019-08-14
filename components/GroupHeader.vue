<template>
  <b-card bg-light>
    <b-row v-if="profile" class="mt-1">
      <b-col lg="2" class="order-0">
        <b-img-lazy rounded thumbnail alt="Community profile picture" :src="profile" class="js-pageimage" />
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
        <b-card-title>{{ namedisplay }}</b-card-title>
        <b-card-sub-title>{{ tagline }}</b-card-sub-title>
        <p class="text-muted small">
          Founded {{ founded | dateonly }}. {{ membercount.toLocaleString() }} current freeglers.
          <nuxt-link :to="{ path: '/stats/' + nameshort }">
            More stats
          </nuxt-link> or <nuxt-link :to="{ path: '/stories/' + id }">
            stories
          </nuxt-link>
        </p>
        <p v-if="!description">
          Give and get stuff for free with {{ namedisplay }}.  Offer things you don't need, and ask for things you'd like.  Don't just recycle - reuse with Freegle!
        </p>
        <!-- eslint-disable-next-line -->
                <span v-if="description" v-html="description" />
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
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    nameshort: {
      type: String,
      default: null
    },
    namedisplay: {
      type: String,
      default: null
    },
    tagline: {
      type: String,
      default: null
    },
    founded: {
      type: String,
      default: null
    },
    membercount: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: null
    },
    profile: {
      type: String,
      default: null
    }
  },
  computed: {
    amAMember() {
      return this.$store.getters['group/member'](this.id)
    }
  }
}
</script>
