<template>
  <b-card v-if="show && message && group" no-body>
    <b-card-header>
      <div class="d-flex justify-content-between">
        <div>
          Share to community Facebook pages
        </div>
        <div class="small text-muted">
          {{ timeago(item.date) }}
        </div>
      </div>
    </b-card-header>
    <!-- eslint-disable-next-line-->
    <b-card-body>
      <p class="small text-muted">
        This will share a popular post to Facebook so that people there
        who aren't on Freegle see things that are appealing.
      </p>
      <p>
        FREE! Trending yesterday on {{ group.namedisplay }}:
      </p>
      <p>
        {{ message.subject }}
      </p>
      <p>
        Hop over to &lt;shortlink will be automatically inserted here&gt; to see what else is being given away, or to ask for stuff you'd like.
      </p>
      <MessageSummary :id="message.id" :replyable="false" />
    </b-card-body>
    <b-card-footer>
      <SpinButton
        variant="white"
        name="share-alt"
        :label="'Share on ' + group.namedisplay"
        :handler="share"
        class="mt-1 mb-1"
      />
      <SpinButton
        variant="white"
        name="trash-alt"
        :label="'Hide for ' + group.namedisplay"
        :handler="hide"
        class="mt-1 mb-1"
      />
    </b-card-footer>
  </b-card>
</template>
<script>
import SpinButton from '@/components/SpinButton'
import MessageSummary from '@/components/MessageSummary'

export default {
  components: {
    SpinButton,
    MessageSummary
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      show: true
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.item.msgid)
    },
    group() {
      return this.$store.getters['group/get'](this.item.groupid)
    }
  },
  mounted() {
    this.$store.dispatch('messages/fetch', {
      id: this.item.msgid
    })

    this.$store.dispatch('group/fetch', {
      id: this.item.groupid
    })
  },
  methods: {
    updateWork() {
      this.fetchMe(['work'])
    },
    async share() {
      await this.$store.dispatch('publicity/sharePopularPost', {
        groupid: this.item.groupid,
        msgid: this.item.msgid
      })

      this.show = false
    },
    async hide() {
      await this.$store.dispatch('publicity/hidePopularPost', {
        groupid: this.item.groupid,
        msgid: this.item.msgid
      })

      this.show = false
    }
  }
}
</script>
