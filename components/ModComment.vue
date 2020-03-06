<template>
  <NoticeMessage v-if="savedComment" variant="danger" class="mb-2">
    <div v-for="n in 10" :key="'modcomments-' + user.id + '-' + savedComment.id + '-' + n">
      <b>{{ savedComment['user' + n] }}</b>
    </div>
    <div class="small">
      <span v-if="savedComment.byuser">
        <v-icon name="tag" /> by {{ savedComment.byuser.displayname }}
      </span>
      {{ savedComment.date | timeago }}
      <span v-if="savedComment.groupid">
        on {{ groupname }}
      </span>
      <b-btn v-if="canEdit" variant="link" size="sm" @click="editIt">
        <v-icon name="pen" /> Edit
      </b-btn>
      <b-btn v-if="canEdit" variant="link" size="sm" @click="deleteIt">
        <v-icon name="trash-alt" /> Delete
      </b-btn>
    </div>
    <ConfirmModal ref="confirm" @confirm="deleteConfirmed" />
    <ModCommentEditModal v-if="canEdit" ref="editComment" :user="user" :comment="comment" @edited="updateComments" />
  </NoticeMessage>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
import NoticeMessage from './NoticeMessage'
import ModCommentEditModal from './ModCommentEditModal'
const ConfirmModal = () => import('~/components/ConfirmModal.vue')

export default {
  components: { ModCommentEditModal, NoticeMessage, ConfirmModal },
  props: {
    comment: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      savedComment: null
    }
  },
  computed: {
    group() {
      return this.comment.groupid
        ? this.$store.getters['auth/groupById'](this.comment.groupid)
        : null
    },
    groupname() {
      return this.group ? this.group.namedisplay : null
    },
    canEdit() {
      return (
        this.supportOrAdmin ||
        (this.group &&
          (this.group.role === 'Owner' || this.group.role === 'Moderator'))
      )
    }
  },
  mounted() {
    // To stop it updating on screen when editing in a modal.
    this.savedComment = cloneDeep(this.comment)
  },
  methods: {
    async updateComments() {
      // The server API doesn't make it easy to refresh comments on memberships, because we can't refetch a
      // specific membership id.  Instead fetch the user and then pass any comments to the store to update there.
      await this.$store.dispatch('user/fetch', {
        id: this.comment.userid,
        info: true
      })

      const user = this.$store.getters['user/get'](this.comment.userid)

      await this.$store.dispatch('members/updateComments', {
        userid: user.id,
        comments: user.comments
      })

      this.savedComment = user.comments.find(comm => {
        return comm.id === this.savedComment.id
      })
    },

    deleteIt() {
      this.$refs.confirm.show()
    },

    async deleteConfirmed() {
      // Go direct to API because comments aren't in the Store separately.
      await this.$api.comment.del(this.comment.id)

      this.updateComments()
    },

    editIt() {
      this.$refs.editComment.show()
    }
  }
}
</script>
