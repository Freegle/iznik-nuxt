<template>
  <div>
    <b-modal
      id="addMemberModal"
      v-model="showModal"
      title="Merge Member"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <div v-if="merged">
          We've merged them.
        </div>
        <div v-else>
          <NoticeMessage variant="danger">
            Please be careful!  You can't undo this without geek help (and even then it is imperfect).  So please be
            completely sure that these are the same users.
          </NoticeMessage>
          <div v-if="supportOrAdmin" class="d-flex justify-content-around">
            <OurToggle
              v-model="byemail"
              class="mt-4"
              :height="30"
              :width="150"
              :font-size="14"
              :sync="true"
              :labels="{checked: 'Merge by email', unchecked: 'Merge by user id'}"
              color="#61AE24"
            />
          </div>
          <div v-if="byemail">
            <p class="mt-2">
              This will merge from the first user into the second user.  The second user's
              preferred email will be the preferred email of the merged user, so make sure you get
              this the right way round.
            </p>
            <div class="d-flex justify-content-between flex-wrap">
              <b-input v-model="email1" type="email" placeholder="First email" class="mt-2 mb-2" />
              <b-input v-model="email2" type="email" placeholder="Second email (and email of merged user)" class="mt-2 mb-2" />
            </div>
          </div>
          <div v-else>
            <p class="mt-2">
              This will merge from the first user into the second user.  The second user's
              preferred email, if any, will be the preferred email of the merged user, so make sure you get
              this the right way round.  This is Support-only, as there's more scope for messing up if you get the
              ids wrong - so do be very careful.
            </p>
            <div class="d-flex justify-content-between flex-wrap">
              <b-input v-model="id1" type="number" placeholder="First user id" class="mt-2 mb-2" />
              <b-input v-model="id2" type="number" placeholder="Second user id" class="mt-2 mb-2" />
            </div>
          </div>
          <b-input v-model="reason" placeholder="Enter a reason for the logs" class="mt-2 mb-2" />
          <NoticeMessage v-if="tn" variant="danger">
            You can't merge TrashNothing members.  Please either remove the least active of them, or add Notes to each
            one to say that they're the same real person.
          </NoticeMessage>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button v-if="!merged" variant="primary" :disabled="!email1 || !email2 || !reason || tn" @click="merge">
          Merge
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import NoticeMessage from './NoticeMessage'

const OurToggle = () => import('~/components/OurToggle')

export default {
  components: { NoticeMessage, OurToggle },
  mixins: [modal],
  data: function() {
    return {
      email1: null,
      email2: null,
      id1: null,
      id2: null,
      reason: null,
      merged: false,
      byemail: true
    }
  },
  computed: {
    tn() {
      return (
        (this.email1 && this.email1.indexOf('trashnothing') !== -1) ||
        (this.email2 && this.email2.indexOf('trashnothing') !== -1)
      )
    }
  },
  methods: {
    async merge() {
      if (this.byemail) {
        await this.$store.dispatch('user/merge', {
          email1: this.email1,
          email2: this.email2,
          reason: this.reason
        })
      } else {
        await this.$store.dispatch('user/merge', {
          id1: this.id1,
          id2: this.id2,
          reason: this.reason
        })
      }

      this.merged = true
    }
  }
}
</script>
