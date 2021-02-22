<template>
  <div>
    <div v-if="microvolunteering.result === 'Reject'" class="border border-warning rounded p-2">
      <nuxt-link :to="'/modtools/members/approved/search/' + microvolunteering.userid">
        <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ microvolunteering.userid }}
      </nuxt-link>
      <span v-if="user">
        <strong>{{ user.displayname }}</strong>
        <span v-if="email">
          ({{ email }})
        </span>
      </span>
      thinks this post
      <strong v-if="microvolunteering.msgcategory === 'CouldBeBetter'" class="text-warning">
        Could be better
      </strong>
      <strong v-else-if="microvolunteering.msgcategory === 'ShouldntBeHere'" class="text-danger">
        shouldn't be here
      </strong>
      <br>
      <span v-if="microvolunteering.comments" class="font-weight-bold">"{{ microvolunteering.comments }}"</span>
      <em v-else>No comment supplied.</em>
    </div>
    <div v-if="microvolunteering.result === 'Approve'" class="border border-success rounded p-2">
      <nuxt-link :to="'/modtools/members/approved/search/' + microvolunteering.userid">
        <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ microvolunteering.userid }}
      </nuxt-link>
      <span v-if="user">
        <strong>{{ user.displayname }}</strong>
        <span v-if="email">
          ({{ email }})
        </span>
      </span>
      thinks this post is ok.
      <br>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    microvolunteering: {
      type: Object,
      required: true
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/get'](this.microvolunteering.userid)
    },
    email() {
      let ret = null

      if (this.user) {
        this.user.emails.forEach(e => {
          if (!e.ourdomain && (!ret || e.preferred)) {
            ret = e.email
          }
        })
      }

      return ret
    }
  },
  mounted() {
    this.$store.dispatch('user/fetch', {
      id: this.microvolunteering.userid
    })
  }
}
</script>
