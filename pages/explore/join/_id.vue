<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <NoticeMessage v-if="invalid" variant="danger" class="mt-2">
          That community name is invalid - please check it.
        </NoticeMessage>
        <div v-else>
          <ExploreGroup v-if="id" :id="id" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import NoticeMessage from '@/components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'
const ExploreGroup = () => import('~/components/ExploreGroup.vue')

export default {
  components: {
    NoticeMessage,
    ExploreGroup
  },
  mixins: [loginRequired],
  data: function() {
    return {
      id: null,
      invalid: false
    }
  },
  watch: {
    me(newVal, oldVal) {
      if (!oldVal && newVal) {
        // We weren't logged in on load but we are now. Join.
        this.join()
      }
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id) || null
  },
  async mounted() {
    if (this.id) {
      try {
        await this.$store.dispatch('group/fetch', {
          id: this.id
        })

        if (this.me) {
          // Logged in on load - join
          this.join()
        }
      } catch (e) {
        console.error('Invalid group', e)
        this.invalid = true
      }
    } else {
      this.$router.push('/explore')
    }
  },
  methods: {
    async join() {
      const group = this.$store.getters['group/get'](this.id)

      await this.$store.dispatch('auth/joinGroup', {
        userid: this.me.id,
        groupid: group.id
      })

      // Route back.
      this.$router.push('/explore/' + this.id)
    }
  }
}
</script>
