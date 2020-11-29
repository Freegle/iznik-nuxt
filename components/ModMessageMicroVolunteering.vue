<template>
  <div class="border border-warning rounded p-2">
    <a :href="'/modtools/members/approved/search/' + microvolunteering.userid">
      <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ microvolunteering.userid }}
    </a>
    <span v-if="user">
      <b>{{ user.displayname }}</b>
      <span v-if="email">
        ({{ email }})
      </span>
    </span>
    :
    <br>
    <b v-if="microvolunteering.comments">"{{ microvolunteering.comments }}"</b>
    <em v-else>No comment supplied.</em>
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
