<template>
  <div>
    <ModHelpSpammers />
    <div>
      <div>
        <b-tabs v-model="tabIndex" content-class="mt-3" card lazy>
          <b-tab id="Spammers" :active="!supportOrAdmin">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Confirmed Spammers
              </h2>
            </template>
            <!--            TODO Search-->
          </b-tab>
          <b-tab v-if="supportOrAdmin" id="PendingAdd">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Pending Add
                <b-badge v-if="pendingaddcount" variant="danger">
                  {{ pendingaddcount }}
                </b-badge>
              </h2>
            </template>
          </b-tab>
          <b-tab v-if="supportOrAdmin" id="Whitelisted">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Whitelisted
              </h2>
            </template>
          </b-tab>
          <b-tab v-if="supportOrAdmin" id="PendingRemove">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Pending Remove
                <b-badge v-if="pendingremovecount" variant="danger">
                  {{ pendingremovecount }}
                </b-badge>
              </h2>
            </template>
          </b-tab>
        </b-tabs>
        <ModMember v-for="spammer in visibleSpammers" :key="'spammer-' + tabIndex + '-' + spammer.id" :member="spammer.user" />
        <b-img v-if="busy" src="~/static/loader.gif" alt="Loading" />
        <div v-else-if="!spammers.length">
          Nothing to show just now.
        </div>
        <infinite-loading :key="'infinite-' + '-' + tabIndex + '-' + bump" force-use-infinite-wrapper="body" :distance="1000" @infinite="loadMore">
          <span slot="no-results" />
          <span slot="no-more" />
          <span slot="spinner" />
        </infinite-loading>
      </div>
    </div>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ModHelpSpammers from '../../components/ModHelpSpammers'
import ModMember from '../../components/ModMember'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: {
    ModMember,
    ModHelpSpammers,
    InfiniteLoading
  },
  mixins: [loginRequired],
  data: function() {
    return {
      tabIndex: 0,
      show: 0,
      busy: false,
      bump: 0
    }
  },
  computed: {
    pendingaddcount() {
      const work = this.$store.getters['auth/work']
      return work.spammerpendingadd
    },
    pendingremovecount() {
      const work = this.$store.getters['auth/work']
      return work.spammerpendingremove
    },
    spammers() {
      const ret = this.$store.getters['spammers/list'](this.collection)

      // Need to move the byuser into the spammer object so that ModSpammer finds it.
      ret.forEach(s => {
        s.user.spammer.byuser = s.byuser
      })

      return ret
    },
    visibleSpammers() {
      return this.spammers ? this.spammers.slice(0, this.show) : []
    },
    collection() {
      let ret = null

      switch (this.tabIndex) {
        case 0: {
          ret = 'Spammer'
          break
        }
        case 1: {
          ret = 'PendingAdd'
          break
        }
        case 2: {
          ret = 'Whitelisted'
          break
        }
        case 3: {
          ret = 'PendingRemove'
          break
        }
      }

      console.log('Spammer collection', this.tabIndex, ret)
      return ret
    }
  },
  watch: {
    tabIndex(newVal) {
      this.$store.dispatch('spammers/clear')
      this.bump++
    },
    $route(to, from) {
      console.log('Route', to, from)
      // Clear store when we move away to prevent items showing again when we come back on potentially a different tab.
      this.$store.dispatch('spammers/clear')
    }
  },
  mounted() {
    // Start in Pending Add if they have rights to see it.
    console.log('Mounted', this.supportOrAdmin)
    if (this.supportOrAdmin) {
      this.tabIndex = 1
    } else {
      this.tabIndex = 0
    }
  },
  layout: 'modtools',
  methods: {
    loadMore: function($state) {
      this.busy = true

      if (this.show < this.spammers.length) {
        // This means that we will gradually add the members that we have fetched from the server into the DOM.
        // Doing that means that we will complete our initial render more rapidly and thus appear faster.
        this.show++
        $state.loaded()
      } else {
        const currentCount = this.spammers.length

        this.$store
          .dispatch('spammers/fetch', {
            collection: this.collection,
            modtools: true
          })
          .then(() => {
            this.context = this.$store.getters['spammers/getContext']

            if (currentCount === this.spammers.length) {
              this.busy = false
              $state.complete()
            } else {
              $state.loaded()
              this.busy = false
              this.show++
            }
          })
          .catch(e => {
            $state.complete()
            this.busy = false
            console.log('Complete on error', e)
          })
      }
    }
  }
}
</script>
<style scoped>
</style>
