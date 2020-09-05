<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpFeedback />
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" modonly all />
        <b-select v-model="filter">
          <option value="Comments">
            With Comments
          </option>
          <option value="Happy">
            Happy
          </option>
          <option value="Unhappy">
            Unhappy
          </option>
          <option value="Fine">
            Fine
          </option>
        </b-select>
      </div>
      <b-card v-if="happinessData.length" variant="white" class="mt-1">
        <b-card-text>
          <p class="text-center">
            This is what people have said over the last year<span v-if="!groupid"> across all of Freegle</span>.
          </p>
          <GChart
            type="PieChart"
            :data="happinessData"
            :options="happinessOptions"
          />
        </b-card-text>
      </b-card>

      <div v-for="member in visibleMembers" :key="'memberlist-' + member.id" class="p-0 mt-2">
        <ModMemberHappiness v-if="filterMatch(member)" :id="member.id" />
      </div>

      <NoticeMessage v-if="!members.length && !busy" class="mt-2">
        There are no items to show at the moment.
      </NoticeMessage>

      <infinite-loading :key="'infinite-' + groupid + '-' + filter" force-use-infinite-wrapper="body" :distance="distance" @infinite="loadMore">
        <span slot="no-results" />
        <span slot="no-more" />
        <span slot="spinner">
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </span>
      </infinite-loading>
    </client-only>
  </div>
</template>
<script>
import { GChart } from 'vue-google-charts'
import ModHelpFeedback from '../../../../components/ModHelpFeedback'
import ScrollToTop from '../../../../components/ScrollToTop'
import NoticeMessage from '@/components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import ModMemberHappiness from '@/components/ModMemberHappiness'

export default {
  components: {
    ScrollToTop,
    ModHelpFeedback,
    ModMemberHappiness,
    NoticeMessage,
    GChart
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/feedback'),
    modMembersPage
  ],
  data: function() {
    return {
      collection: 'Happiness',
      filter: 'Comments',
      happinessOptions: {
        // title: 'Freegler Feedback',
        chartArea: { width: '80%', height: '80%' },
        colors: ['green', 'blue', 'orange'],
        slices2: {
          1: { offset: 0.2 },
          2: { offset: 0.2 },
          3: { offset: 0.2 }
        }
      },
      happinessData: []
    }
  },
  watch: {
    filter() {
      this.context = null
      this.show = 0
      this.$store.dispatch('members/clear')
    }
  },
  async mounted() {
    const start = this.$dayjs()
      .subtract(1, 'year')
      .toDate()

    const ret = await this.$api.dashboard.fetch({
      components: ['Happiness'],
      start: start,
      end: new Date().toISOString(),
      allgroups: !this.groupid,
      group: this.groupid > 0 ? this.groupid : null,
      systemwide: this.groupid < 0
    })

    if (ret.Happiness) {
      this.happinessData = [['Feedback', 'Count']]

      ret.Happiness.forEach(h => {
        this.happinessData.push([h.happiness, h.count])
      })
    }
  },
  methods: {
    filterMatch(member) {
      const val = member.happiness

      if (!this.filter) {
        return true
      }

      if (this.filter === 'Comments') {
        const comment = member.comments
          ? member.comments.replace(/[\n\r]+/g, '').trim()
          : ''

        if (
          comment.length &&
          comment !== 'Sorry, this is no longer available.' &&
          comment !== 'Thanks, this has now been taken.' &&
          comment !== "Thanks, I'm no longer looking for this." &&
          comment !== 'Sorry, this has now been taken.' &&
          comment !== 'Thanks for the interest, but this has now been taken.' &&
          comment !== 'Thanks, these have now been taken.' &&
          comment !== 'Thanks, this has now been received.'
        ) {
          return true
        }
      } else {
        if (this.filter === val) {
          return true
        }

        if (this.filter === 'Fine' && !val) {
          return true
        }
      }

      return false
    }
  }
}
</script>
<style scoped>
select {
  max-width: 300px;
}
</style>
