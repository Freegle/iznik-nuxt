<template>
  <div>
    <b-row v-if="invalid" class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <NoticeMessage variant="danger" class="mt-2">
          That community name is invalid - please check it.
        </NoticeMessage>
      </b-col>
    </b-row>
    <div v-else>
      <client-only>
        <ExploreGroup v-if="id" :id="id" />
        <ExploreMap
          v-else
          :swlat="swlat"
          :swlng="swlng"
          :nelat="nelat"
          :nelng="nelng"
          track
        />
      </client-only>
    </div>
  </div>
</template>
<script>
import NoticeMessage from '../../components/NoticeMessage'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
const ExploreGroup = () => import('~/components/ExploreGroup.vue')
const ExploreMap = () => import('~/components/ExploreMap.vue')

export default {
  components: {
    NoticeMessage,
    ExploreGroup,
    ExploreMap
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
          await store.dispatch('group/fetch', {
            id: params.id,
            showmods: true,
            sponsors: true
          })

          group = store.getters['group/get'](params.id)
        }

        await store.dispatch('messages/fetchMessages', {
          groupid: group.id,
          collection: 'Approved',
          summary: true,
          types: ['Offer', 'Wanted'],
          limit: process.browser ? 5 : 100 // During SSR fetch more, for better SEO.
        })
      } catch (e) {
        console.error('Invalid group', e)
        invalid = true
      }
    } else {
      await store.dispatch('group/list', {
        grouptype: 'Freegle'
      })
    }

    return {
      asyncGroupId: params.id,
      invalid: invalid
    }
  },
  created() {
    this.id = this.$route.params.id

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
      if (this.invalid) {
        return this.buildHead('Explore ' + this.id)
      } else {
        return this.buildHead(group.namedisplay, group.tagline, group.profile)
      }
    } else {
      return this.buildHead(
        'Explore Freegle Groups',
        "There are lots of lovely communities of freeglers across the UK. Shall we see what they're up to?",
        null
      )
    }
  }
}
</script>
