<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpFeedback />
      <div class="d-flex justify-content-between">
        <GroupSelect v-model="groupid" modonly all remember="membersfeedback" />
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
        <b-btn variant="white" @click="markAll">
          Mark all as seen
        </b-btn>
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


      <div v-for="item in visibleItems" :key="'memberlist-' + item.id" class="p-0 mt-2">
        <ModMemberHappiness v-if="item.type === 'Member' && filterMatch(item.object)" :id="item.object.id" />
        <ModMemberRating v-if="item.type === 'Rating'" :rating="item.object" class="mt-2" />
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
import loginRequired from '@/mixins/loginRequired'
import modMembersPage from '@/mixins/modMembersPage'
import createGroupRoute from '@/mixins/createGroupRoute'
import ScrollToTop from '../../../../components/ScrollToTop'
import ModHelpFeedback from '../../../../components/ModHelpFeedback'
import ModMemberHappiness from '~/components/ModMemberHappiness'
import ModMemberRating from '~/components/ModMemberRating'
import NoticeMessage from '~/components/NoticeMessage'

export default {
  components: {
    ScrollToTop,
    ModHelpFeedback,
    ModMemberHappiness,
    ModMemberRating,
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
        chartArea: {
          width: '80%',
          height: '80%'
        },
        pieSliceBorderColor: 'darkgrey',
        colors: ['green', '#f8f9fa', 'orange'],
        slices2: {
          1: { offset: 0.2 },
          2: { offset: 0.2 },
          3: { offset: 0.2 }
        }
      },
      happinessData: [],
      // Get everything (probably) so that the ratings and feedback are interleaved.
      limit: 1000
    }
  },
  computed: {
    uniqueMembers() {
      const userids = []
      const ret = []

      this.members.forEach(m => {
        const id = m.userid ?? m.fromuser

        if (!userids[id]) {
          userids[id] = true
          ret.push(m)
        }
      })

      return ret
    },
    ratings() {
      return this.$store.getters['members/getRatings']
    },
    sortedItems() {
      const objs = []

      this.uniqueMembers.forEach(m => {
        objs.push({
          type: 'Member',
          object: m,
          timestamp: m.timestamp,
          id: 'member-' + m.id
        })
      })

      this.ratings.forEach(r => {
        objs.push({
          type: 'Rating',
          object: r,
          timestamp: r.timestamp,
          id: 'rating-' + r.id
        })
      })

      objs.sort(function(a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })

      return objs
    },
    visibleItems() {
      return this.sortedItems.slice(0, this.toShow)
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

        if (comment.length) {
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
    },
    async markAll() {
      await this.$store.dispatch('members/clear')

      await this.$store.dispatch('members/fetchMembers', {
        groupid: this.groupid,
        collection: this.collection,
        modtools: true,
        summary: false,
        context: null,
        limit: 1000
      })

      this.$nextTick(() => {
        this.members.forEach(async member => {
          if (!member.reviewed) {
            await this.$store.dispatch('members/happinessReviewed', {
              userid: member.fromuser,
              groupid: member.groupid,
              happinessid: member.id
            })
          }
        })

        this.ratings.forEach(async rating => {
          if (rating.reviewrequired) {
            await this.$store.dispatch('user/ratingReviewed', {
              id: rating.id
            })
          }
        })

        this.fetchMe(['work'])
      })
    }
  }
}
</script>
<style scoped>
select {
  max-width: 300px;
}
</style>
