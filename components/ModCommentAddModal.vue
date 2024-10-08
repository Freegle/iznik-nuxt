<template>
  <div>
    <b-modal
      :id="'modCommentModal-' + user.id"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        Add Note for {{ user.displayname }}
      </template>
      <template slot="default">
        <p>
          You can add one or more notes about members.  They'll appear in a coloured box next to the user.
        </p>
        <p>
          These comments can be seen by moderators, and also by members who choose to download their data under
          GDPR.  So keep them objective, polite and factual, and without identifiable personal information please.
        </p>
        <p>
          <!-- eslint-disable-next-line -->
          Read more <ExternalLink href="https://wiki.ilovefreegle.org/Member_Notes">on the wiki</ExternalLink>.
        </p>
        <b-input v-model="user1" :placeholder="placeholders[1]" />
        <b-input v-model="user2" :placeholder="placeholders[2]" />
        <b-input v-model="user3" :placeholder="placeholders[3]" />
        <b-input v-model="user4" :placeholder="placeholders[4]" />
        <b-input v-model="user5" :placeholder="placeholders[5]" />
        <b-input v-model="user6" :placeholder="placeholders[6]" />
        <b-input v-model="user7" :placeholder="placeholders[7]" />
        <b-input v-model="user8" :placeholder="placeholders[8]" />
        <b-input v-model="user9" :placeholder="placeholders[9]" />
        <b-input v-model="user10" :placeholder="placeholders[10]" />
        <b-input v-model="user11" :placeholder="placeholders[11]" />
        <p class="mt-2">
          You can choose for this note to be be alerted to other groups, which will put the member in <em>Member->Review</em>
          if they are an existing member or join a group.  Please use this only for serious issues.
        </p>
        <OurToggle
          :value="flag"
          class="mt-2"
          :height="30"
          :width="250"
          :font-size="14"
          :sync="true"
          :labels="{checked: 'Will alert other groups', unchecked: 'Will not alert other groups'}"
          color="#61AE24"
          @change="toggleFlag"
        />
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button variant="primary" @click="save">
          Add
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import ExternalLink from '~/components/ExternalLink'
const OurToggle = () => import('~/components/OurToggle')

export default {
  components: { OurToggle, ExternalLink },
  mixins: [modal],
  props: {
    user: {
      type: Object,
      required: true
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      user1: null,
      user2: null,
      user3: null,
      user4: null,
      user5: null,
      user6: null,
      user7: null,
      user8: null,
      user9: null,
      user10: null,
      user11: null,
      placeholders: [
        null,
        'Add a comment about this member here',
        '...and more information here',
        '...and here',
        '...you get the idea'
      ],
      flag: false
    }
  },
  methods: {
    toggleFlag() {
      this.flag = !this.flag
    },
    async save() {
      // Go direct to API because comments aren't in the Store separately.
      await this.$api.comment.add({
        userid: this.user.id,
        groupid: this.groupid,
        user1: this.user1,
        user2: this.user2,
        user3: this.user3,
        user4: this.user4,
        user5: this.user5,
        user6: this.user6,
        user7: this.user7,
        user8: this.user8,
        user9: this.user9,
        user10: this.user10,
        user11: this.user11,
        flag: this.flag
      })

      this.$emit('added')
      this.hide()
    }
  }
}
</script>
