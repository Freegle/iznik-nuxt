<template>
  <div>
    <nuxt-link :to="'/chats/' + id" class="nodecor">
      <b-row class="ml-1 mr-1">
        <b-col class="pl-0">
          <b-img-lazy
            v-if="icon"
            rounded="circle"
            thumbnail
            class="profile p-0 ml-1 mb-1 inline"
            alt="Profile picture"
            title="Profile"
            :src="icon"
          />
          <b-img-lazy
            v-else
            rounded="circle"
            thumbnail
            class="profile p-0 ml-1 mb-1 inline"
            alt="Profile picture"
            title="Profile"
            src="~/static/placeholder.jpg"
          />
          <span class="pl-0 mb-0 chatname">
            {{ name }}
          </span>
          <span v-if="unseen">
            <b-badge variant="danger">{{ unseen }}</b-badge>
          </span>
          <span class="float-right small text-muted">
            {{ $moment(lastdate).fromNow() }}
          </span>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="snippet" class="pl-4 truncate">
          {{ esnippet }}
        </b-col>
        <b-col v-else class="pl-4">
          ...
        </b-col>
      </b-row>
    </nuxt-link>
  </div>
</template>
<script>
import twem from '~/assets/js/twem'

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    unseen: {
      type: Number,
      required: false,
      default: 0
    },
    user1: {
      type: Number,
      required: false,
      default: null
    },
    user2: {
      type: Number,
      required: false,
      default: null
    },
    icon: {
      type: String,
      required: false,
      default: null
    },
    lastdate: {
      type: String,
      required: false,
      default: null
    },
    snippet: {
      type: String,
      required: false,
      default: null
    }
  },

  computed: {
    esnippet() {
      let ret = twem.twem(this.$twemoji, this.snippet)

      // The way the snippet is constructed might lead to backslashes if we have an emoji.
      ret = ret.replace(/\\*$/, '') + '...'
      return ret
    }
  }
}
</script>
