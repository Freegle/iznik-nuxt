<template>
  <div>
    <b-row v-if="invalid" class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <NoticeMessage variant="danger" class="mt-2">
          That community name is invalid - please check it.
        </NoticeMessage>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <ExploreGroup v-if="id" :id="id" />
        <div v-else>
          <h1 class="sr-only">
            Freegling map
          </h1>
          <AdaptiveMap :initial-bounds="[ [49.959999905, -7.57216793459], [58.6350001085, 1.68153079591] ]" start-on-groups :initial-group-ids="initialGroupIds" class="mt-2" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import NoticeMessage from '../../components/NoticeMessage'
import AdaptiveMap from '../../components/AdaptiveMap'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
const ExploreGroup = () => import('~/components/ExploreGroup.vue')

export default {
  components: {
    AdaptiveMap,
    NoticeMessage,
    ExploreGroup
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null,
      swlat: null,
      swlng: null,
      nelat: null,
      nelng: null
    }
  },
  async asyncData({ app, params, store }) {
    let invalid = false
    let groupid = params.id
    const groupids = []

    if (params.id) {
      // We need to populate the store on the server so that SSR works.  We can only do this in asyncData - mounted()
      // in the ExploreGroup component is too late.
      //
      // Get the group and approved messages for this group.  We're only interested in showing OFFERs and WANTEDs, and
      // ask for summary info for speed.
      try {
        let group = store.getters['group/get'](params.id)

        if (!group || !group.showmods) {
          // Not fetched yet.
          group = await store.dispatch('group/fetch', {
            id: params.id,
            showmods: true,
            sponsors: true
          })
        }

        if (group) {
          groupid = group.id
          await store.dispatch('messages/fetchMessages', {
            groupid: group.id,
            collection: 'Approved',
            summary: true,
            types: ['Offer', 'Wanted'],
            limit: process.browser ? 5 : 100 // During SSR fetch more, for better SEO.
          })
        }
      } catch (e) {
        console.error('Invalid group', e)
        invalid = true
      }
    } else {
      // Get all the groups in store for the adaptive map.
      await store.dispatch('group/list', {
        grouptype: 'Freegle'
      })

      // Calculate the initial bounds for the region.
      const allGroups = store.getters['group/list']

      for (const ix in allGroups) {
        const group = allGroups[ix]

        if (group.onmap && group.publish) {
          groupids.push(group.id)
        }
      }
    }

    return {
      asyncGroupId: groupid,
      invalid: invalid,
      initialGroupIds: groupids
    }
  },
  created() {
    this.id = this.asyncGroupId ? this.asyncGroupId : this.$route.params.id

    const re = /(.*),(.*),(.*),(.*)/
    const matches = re.exec(this.$route.query.bounds)

    if (this.$route.query.bounds && matches.length === 5) {
      this.swlat = parseFloat(matches[1])
      this.swlng = parseFloat(matches[2])
      this.nelat = parseFloat(matches[3])
      this.nelng = parseFloat(matches[4])
    }
  },
  head() {
    let group

    if (this.asyncGroupId) {
      group = this.$store.getters['group/get'](this.asyncGroupId)
    }

    if (this.id) {
      if (this.invalid || !group) {
        return this.buildHead('Explore ' + this.id)
      } else {
        return this.buildHead(group.namedisplay, group.tagline, group.profile)
      }
    } else {
      return this.buildHead(
        'Explore Freegle Communities',
        "There are lots of lovely communities of freeglers across the UK. Shall we see what they're up to?",
        null
      )
    }
  }
}
</script>
