<template>
  <div>
    <h2>Popular Posts</h2>
    <p>These are the posts which are most viewed (on the website), and most replied to (on the website or by email).</p>
    <b-card v-if="loading" no-body>
      <b-card-body>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
      </b-card-body>
    </b-card>
    <div v-else-if="PopularPosts && PopularPosts.length">
      <b-card no-body>
        <b-card-body>
          <b-row v-for="msg in PopularPosts" :key="'popular-' + msg.id">
            <b-col cols="2">
              <a target="_blank" rel="noopener noreferrer" :href="msg.url">
                <v-icon name="hashtag" scale="0.75" class="text-muted" />{{ msg.id }}
              </a>
            </b-col>
            <b-col cols="6" class="text-success font-weight-bold">
              {{ msg.subject }}
            </b-col>
            <b-col cols="2">
              <div>
                <v-icon name="eye" /> {{ msg.views | pluralize('view', { includeNumber: true }) }}
              </div>
            </b-col>
            <b-col cols="2">
              <div>
                <v-icon name="reply" /> {{ msg.replies | pluralize(['reply', 'replies'], { includeNumber: true }) }}
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

export default {
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: ['PopularPosts'],
      PopularPosts: null
    }
  }
}
</script>
