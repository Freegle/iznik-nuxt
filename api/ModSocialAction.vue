<template>
  <b-card v-if="someleft" no-body>
    <b-card-header>
      <div class="d-flex justify-content-between">
        <div>
          Share to community Facebook pages
        </div>
        <div class="small text-muted">
          {{ item.date | timeago }}
        </div>
      </div>
    </b-card-header>
    <!-- eslint-disable-next-line-->
    <b-card-body v-html="item.iframe" />
    <b-card-footer :key="'sharelist-' + actioned.length">
      <b-btn variant="primary" class="mb-1 mr-1" @click="shareAll">
        <v-icon name="share-alt" />
        Share all
      </b-btn>
      <b-btn
        v-for="group in groups"
        :key="'socialaction-' + group.id"
        :variant="isActioned(group.id) ? 'white' : 'primary'"
        class="mb-1 mr-1"
        :disabled="isActioned(group.id)"
        @click="share(group)"
      >
        <v-icon v-if="isActioned(group.id)" name="check" />
        <v-icon v-else-if="isBusy(group.id)" name="sync" class="fa-spin" />
        <v-icon v-else name="share-alt" />
        {{ group.namedisplay }}
      </b-btn>
      <b-btn variant="danger" class="mb-1 mr-1" @click="hideAll">
        <v-icon name="trash-alt" />
        Hide all
      </b-btn>
    </b-card-footer>
  </b-card>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      busy: [],
      actioned: []
    }
  },
  computed: {
    groups() {
      const ret = []

      // Cloning to avoid some strange issues which cause loops.
      const groups = cloneDeep(this.$store.getters['auth/groups'])

      this.item.uids.forEach(uid => {
        for (const group of groups) {
          if (group.type === 'Freegle' && group.facebook) {
            group.facebook.forEach(facebook => {
              if (parseInt(facebook.uid) === parseInt(uid)) {
                group.facebookuid = facebook.uid
                ret.push(group)
              }
            })
          }
        }
      })

      // Sort so we get the buttons in alphabetical order.
      ret.sort((a, b) => {
        return a.namedisplay
          .toLowerCase()
          .localeCompare(b.namedisplay.toLowerCase())
      })

      return ret
    },
    someleft() {
      let ret = false

      this.groups.forEach(group => {
        if (this.actioned.indexOf(group.id) === -1) {
          ret = true
        }
      })

      return ret
    }
  },
  methods: {
    async share(group) {
      this.busy.push(group.id)

      await this.$store.dispatch('publicity/share', {
        id: this.item.id,
        uid: group.facebookuid
      })

      this.busy = this.busy.filter(g => {
        return g.id !== group.id
      })

      this.actioned.push(group.id)
    },
    async hide(group) {
      this.busy.push(group.id)

      await this.$store.dispatch('publicity/hide', {
        id: this.item.id,
        uid: group.facebookuid
      })

      this.busy = this.busy.filter(g => {
        return g.id !== group.id
      })

      this.actioned.push(group.id)
    },
    shareAll() {
      this.groups.forEach(group => {
        if (this.actioned.indexOf(group.id) === -1) {
          this.share(group)
        }
      })
    },
    hideAll() {
      this.groups.forEach(group => {
        if (this.actioned.indexOf(group.id) === -1) {
          this.hide(group)
        }
      })
    },
    isActioned(groupid) {
      return this.actioned.indexOf(groupid) !== -1
    },
    isBusy(groupid) {
      return this.busy.indexOf(groupid) !== -1
    }
  }
}
</script>
