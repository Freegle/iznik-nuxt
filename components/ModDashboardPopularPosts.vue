<template>
  <div>
    <h2>Popular Posts <span class="text-muted">on {{ groupName }}</span></h2>
    <p>These are the posts which are most viewed (on the website), and most replied to (on the website or by email).</p>
    <b-card v-if="loading" no-body>
      <b-card-body>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row>
          <b-col class="text-faded pulsate text-center">
            Loading...
          </b-col>
        </b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
      </b-card-body>
    </b-card>
    <div v-else-if="PopularPosts && PopularPosts.length">
      <b-card no-body>
        <b-card-body>
          <b-row v-for="msg in PopularPosts" :key="'popular-' + msg.id">
            <b-col cols="4" sm="2">
              <ExternalLink :href="msg.url">
                <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ msg.id }}
              </ExternalLink>
            </b-col>
            <b-col cols="8" sm="6" class="text-success font-weight-bold">
              {{ msg.subject }}
            </b-col>
            <b-col cols="6" sm="2">
              <div>
                <v-icon name="eye" /> web {{ $pluralize('view', msg.views, true) }}
              </div>
            </b-col>
            <b-col cols="6" sm="2">
              <div>
                <v-icon name="reply" /> {{ $pluralize('reply', msg.replies, true ) }}
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>
<script>
import ModDashboardBase from '@/components/ModDashboardBase'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { ExternalLink },
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: ['PopularPosts'],
      PopularPosts: null
    }
  }
}
</script>
