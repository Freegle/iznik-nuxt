<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <h1 class="text-center">
          Ok, what are you looking for?
        </h1>
        <b-row>
          <b-col class="text-muted pl-0 pt-1 text-center">
            We'll search so that you can see if someone has already posted an OFFER. If not, you can post a WANTED for it.
          </b-col>
        </b-row>
        <b-row>
          <b-col class="d-flex justify-content-center mt-3 mb-3">
            <div class="term__search-options">
              <b-form-radio-group
                v-model="searchtype"
                :options="options"
                name="radio-inline"
                class="mt-2 mb-2"
                @change="changetype"
              />
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="text-center">
              <autocomplete
                ref="autocomplete"
                v-model="term"
                :url="source"
                param="typeahead"
                anchor="name"
                label=""
                :classes="{ input: 'form-control form-control-lg', list: 'iteminp' }"
                :min="2"
                :debounce="100"
                :process="process"
                :size="60"
                maxlength="60"
                spellcheck="true"
                placeholder="e.g. sofa, bike, desk..."
                searchbutton="true"
                :on-select="select"
                @search="search"
              />
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-center mt-2 mb-2">
            <em v-if="filteredMessages.length">Or</em>
            <em v-else-if="!busy">No posts to show.</em>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-center">
            <b-btn to="/find/whatisit" size="lg" :variant="searchTermEntered ? 'primary' : 'white'">
              Post a WANTED
            </b-btn>
          </b-col>
        </b-row>
        <b-row v-if="filteredMessages.length">
          <b-col class="text-center mt-3">
            <h2 v-if="!term || !term.length">
              Or just browse...
            </h2>
          </b-col>
        </b-row>
        <b-row v-if="term || postcode">
          <b-col>
            <div v-for="message in filteredMessages" :key="'message-' + message.id" class="p-0">
              <message v-if="message.type == searchtype" v-bind="message" />
            </div>

            <client-only>
              <infinite-loading :key="searchtype" :distance="distance" @infinite="loadMore">
                <span slot="no-results" />
                <span slot="no-more" />
                <span slot="spinner">
                  <b-img-lazy src="~/static/loader.gif" alt="Loading" />
                </span>
              </infinite-loading>
            </client-only>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import Autocomplete from '~/components/Autocomplete'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
const Message = () => import('~/components/Message.vue')

export default {
  components: {
    InfiniteLoading,
    Autocomplete,
    Message
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      options: [
        { text: 'Search OFFERs', value: 'Offer' },
        { text: 'Search WANTEDs', value: 'Wanted' }
      ],
      searchtype: 'Offer',
      source: process.env.API + '/item',
      complete: false,
      distance: 1000,
      busy: false
    }
  },
  computed: {
    postcode() {
      return this.$store.getters['compose/getPostcode']
    },
    messages() {
      let messages

      if (this.group) {
        messages = this.$store.getters['messages/getByGroup'](this.group.id)
      } else {
        messages = this.$store.getters['messages/getAll']
      }

      return messages
    },
    filteredMessages() {
      return this.messages.filter(message => {
        return !message.outcomes || message.outcomes.length === 0
      })
    },
    searchTermEntered() {
      return this.term && this.term.length
    }
  },
  asyncData({ app, params, store }) {
    // Get any value passed in the url for what to search for
    let term = params.term
    term = term && term !== 'null' ? term : null

    return {
      term: term
    }
  },
  mounted() {
    if (!this.postcode || !this.postcode.id) {
      // We shouldn't come directly into this page.
      this.$router.push('/find')
    } else {
      this.$refs.autocomplete.setValue(this.term)

      // Ensure we have no cached messages for other searches/groups
      this.$store.dispatch('messages/clear')

      // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
      // need to render this on the server.
      this.$nextTick(this.search)

      // We need some fettling of the input keystrokes.
      const input = this.$refs.autocomplete.$refs.input
      input.addEventListener('keydown', this.keydown, false)
    }
  },
  // async asyncData({ app, params, store }) {
  //   this.loadMessages()
  // },
  methods: {
    keydown(e) {
      if (e.which === 8) {
        // Backspace means we no longer have a full item.  Parent might want to know that we don't have a valid
        // item any more.
        this.$emit('cleared')
        this.results = null
      }

      if (this.$refs.autocomplete && this.$refs.autocomplete.$refs) {
        // We've seen this not be defined - perhaps during navigation when we're destroying this component?
        // If the ref isn't present then it doesn't make sense to emit the event.
        const input = this.$refs.autocomplete.$refs.input
        this.$emit('typed', input.value)
      }
    },
    process(results) {
      const items =
        results.items.length > 5 ? results.items.slice(0, 5) : results.items
      const ret = []
      for (const item of items) {
        if (item && item.item) {
          ret.push(item.item)
        }
      }

      this.results = ret
      return ret
    },
    select() {
      // DOM not updated yet.
      this.$nextTick(this.search)
    },
    search() {
      const term = this.$refs.autocomplete.$refs.input.value
      this.$router.push('/search/' + term)
    },
    loadMore: function($state) {
      const term = this.$refs.autocomplete.$refs.input.value
      this.busy = true

      const currentCount = this.messages.length

      let params = null

      if (term) {
        params = {
          collection: 'Approved',
          summary: true,
          messagetype: this.searchtype,
          search: term,
          nearlocation:
            this.postcode && this.postcode.id ? this.postcode.id : null,
          subaction: 'searchmess'
        }
      } else {
        params = {
          collection: 'Approved',
          summary: true,
          types: [this.searchtype]
        }
      }

      const groupid = this.$store.getters['compose/getGroup']
      params.groupid = groupid

      this.$store
        .dispatch('messages/fetchMessages', params)
        .then(() => {
          if (currentCount === this.messages.length) {
            this.complete = true
            $state.complete()
          } else {
            $state.loaded()
          }

          this.busy = false
        })
        .catch(() => {
          $state.complete()
          this.busy = false
        })
    },
    changetype: function() {
      // Reset the messages to force refetch.
      this.$store.dispatch('messages/clear')
    }
  },

  head() {
    return this.buildHead(this.term ? 'Search results: ' + this.term : 'Search')
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.form-group {
  border: 1px $color-gray--dark solid;
  border-radius: 0.2rem;
}

.term__search-options {
  display: inline-block;
  border: 1px solid $color-gray--base;
  border-radius: 3px;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
