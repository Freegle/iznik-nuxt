<template>
  <div>
    <b-modal
      id="banMemberModal"
      v-model="showModal"
      title="Ban Member"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <NoticeMessage v-if="homeGroup" variant="danger" class="mb-2">
          <p>
            You are banning this member on their home group.  This should be an absolute last resort - it's
            basically stopping them using Freegle at all.
          </p>
          <p>
            Please don't ban members on their home group because they've joined other groups.  Let those other
            groups ban them if they wish.
          </p>
        </NoticeMessage>
        <NoticeMessage v-else variant="info" class="mb-2">
          Please be responsible in how you use this feature - it should
          be a last resort.
        </NoticeMessage>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
        <b-button variant="primary" :disabled="!userid" @click="ban">
          Ban
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  mixins: [modal],
  props: {
    userid: {
      type: Number,
      required: true
    },
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      homeGroup: false
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.groupid)
    },
    user() {
      return this.$store.getters['user/get'](this.userid)
    }
  },
  mounted() {
    const area = this.group.poly || this.group.polyofficial
    console.log('Area', area)

    const Wkt = require('wicket')
    const wkt = new Wkt.Wkt()
    wkt.read(area)
    const obj = wkt.toObject()
    const bounds = obj.getBounds()
    console.log('Bounds', bounds, this.user)

    const lat = this.user.settings?.mylocation?.lat
    const lng = this.user.settings?.mylocation?.lng
    console.log(
      'Check home',
      this.user.memberof.length,
      bounds,
      lat,
      lng,
      bounds.contains([lat, lng])
    )

    if (this.user.memberof.length === 1 || bounds.contains([lat, lng])) {
      this.homeGroup = true
    }
  },
  methods: {
    ban() {
      this.$emit('confirm')
      this.hide()
    }
  }
}
</script>
