<template>
  <b-card bg-variant="white" no-body>
    <b-card-header class="d-flex justify-content-between flex-wrap">
      <div>
        <v-icon name="envelope" /> <ExternalLink :href="'mailto:' + email">{{ email }}</ExternalLink>
      </div>
      <div>
        <ProfileImage :image="comment.user.profile.turl" class="ml-1 mb-1 inline" is-thumbnail size="sm" />
        {{ comment.user.displayname }}
      </div>
      <div v-if="comment.user.lastaccess">
        <v-icon name="calendar-alt" /> Active {{ comment.user.lastaccess | datetimeshort }}
      </div>
      <div>
        <v-icon name="hashtag" />{{ comment.user.id }}
      </div>
    </b-card-header>
    <b-card-body>
      <ModComment :key="'comment-' + comment.id" :comment="comment" :user="comment.user" />
    </b-card-body>
  </b-card>
</template>
<script>
import ModComment from './ModComment'
import ProfileImage from './ProfileImage'
const ExternalLink = () => import('~/components/ExternalLink')
export default {
  components: { ProfileImage, ModComment, ExternalLink },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    email() {
      let ret = null

      if (!this.comment.user.email && this.comment.user.emails) {
        this.comment.user.emails.forEach(e => {
          if (!e.ourdomain && (!ret || e.preferred)) {
            ret = e.email
          }
        })
      }

      return ret
    }
  }
}
</script>
