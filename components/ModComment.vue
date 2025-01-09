<template>
  <NoticeMessage v-if="savedComment" variant="danger" class="mb-2">
    <div v-for="n in 10" :key="'modcomments-' + user.id + '-' + savedComment.id + '-' + n">
      <div class="d-flex">
        <div v-if="n === 1 && savedComment.flag">
          <v-icon v-if="savedComment.flag" name="exclamation-triangle" class="mr-1" />
        </div>
        <read-more v-if="savedComment['user' + n]" :text="savedComment['user' + n]" :max-chars="expandComments ? 1000 : 80" class="font-weight-bold nopara" />
      </div>
    </div>
    <div class="small">
      <span v-if="savedComment.byuser">
        <v-icon name="tag" /> by {{ savedComment.byuser.displayname }}
      </span>
      <span v-if="savedComment.date !== savedComment.reviewed">
        Created <span :title="datetimeshort(savedComment.date)">{{ datetimeshort(savedComment.date) }}</span> reviewed <span :title="datetimeshort(savedComment.reviewed)">{{ datetimeshort(savedComment.reviewed) }}</span>
      </span>
      <span v-else :title="datetimeshort(savedComment.date)">
        {{ timeadapt(savedComment.date) }}
      </span>
      <span v-if="savedComment.groupid">
        on {{ groupname }}
      </span>
      <span v-if="amAModOn(savedComment.groupid) || supportOrAdmin || savedComment.byuserid === myid">
        <b-btn variant="link" size="sm" @click="editIt">
          <v-icon name="pen" /> Edit
        </b-btn>
        <b-btn variant="link" size="sm" @click="deleteIt">
          <v-icon name="trash-alt" /> Delete
        </b-btn>
      </span>
    </div>
    <ConfirmModal ref="confirm" @confirm="deleteConfirmed" />
    <ModCommentEditModal v-if="amAModOn(savedComment.groupid) || supportOrAdmin" ref="editComment" :user="user" :comment="comment" @edited="updateComments" />
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
    },
    expandComments: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      savedComment: null
    }
  },
  computed: {
    group() {
      let ret = null

      if (this.comment.groupid) {
        ret = this.myGroup(this.comment.groupid)

        if (!ret) {
          ret = this.$store.getters['group/get'](this.comment.groupid)
        }
      }

      return ret
    },
    groupname() {
      return this.group ? this.group.namedisplay : '#' + this.comment.groupid
    }
  },
  mounted() {
    // To stop it updating on screen when editing in a modal.
    this.savedComment = cloneDeep(this.comment)

    if (this.comment.groupid && !this.group) {
      // Need to fetch group
      this.$store.dispatch('group/fetch', {
        id: this.comment.groupid
      })
    }
  },
  methods: {
    async updateComments() {
      // The server API doesn't make it easy to refresh comments on memberships, because we can't refetch a
      // specific membership id.  Instead fetch the user and then pass any comments to the store to update there.
      const userid = this.user.userid ? this.user.userid : this.user.id
      await this.$store.dispatch('user/fetch', {
        id: userid,
        info: true
      })

      const user = this.$store.getters['user/get'](userid)

      await this.$store.dispatch('members/updateComments', {
        userid: userid,
        comments: user.comments
      })

      this.savedComment = user.comments.find(comm => {
        return comm.id === this.savedComment.id
      })

      this.$emit('updated')
    },

    deleteIt() {
      this.waitForRef('confirm', () => {
        this.$refs.confirm.show()
      })
    },

    async deleteConfirmed() {
      // Go direct to API because comments aren't in the Store separately.
      await this.$api.comment.del(this.comment.id)

      this.updateComments()
    },

    editIt() {
      this.waitForRef('editComment', () => {
        this.$refs.editComment.show()
      })
    }
  }
}
</script>
