<template>
  <b-card v-if="someleft" no-body>
    <b-card-header>
      Share to community Facebook pages
    </b-card-header>
    <!-- eslint-disable-next-line-->
    <b-card-body v-html="item.iframe" />
    <b-card-footer :key="'sharelist-' + actioned.length">
      <!--      TODO Share/hide all buttons-->
      <b-btn variant="success" class="mb-1 mr-1" @click="shareAll">
        <v-icon name="share-alt" />
        Share all
      </b-btn>
      <b-btn
        v-for="group in groups"
        :key="'socialaction-' + group.id"
        :variant="group.actioned ? 'white' : 'primary'"
        class="mb-1 mr-1"
        :disabled="group.actioned"
        @click="share(group)"
      >
        <v-icon v-if="group.busy" name="sync" class="fa-spin" />
        <v-icon v-else-if="group.actioned" name="check" />
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
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      actioned: []
    }
  },
  computed: {
    groups() {
      const ret = []

      const groups = this.$store.getters['auth/groups']

      this.item.uids.forEach(uid => {
        for (const group of groups) {
          if (group.type === 'Freegle' && group.facebook) {
            if (this.actioned.indexOf(group.id) !== -1) {
              group.actioned = true
            }

            group.facebook.forEach(facebook => {
              if (parseInt(facebook.uid) === parseInt(uid)) {
                group.facebookuid = facebook.uid
                ret.push(group)
              }
            })
          }
        }
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

      console.log('Some left?', ret)
      return ret
    }
  },
  methods: {
    async share(group) {
      group.busy = true
      await this.$store.dispatch('publicity/share', {
        id: this.item.id,
        uid: group.facebookuid
      })
      group.busy = false
      group.actioned = true
      this.actioned.push(group.id)
    },
    async hide(group) {
      group.busy = true
      await this.$store.dispatch('publicity/hide', {
        id: this.item.id,
        uid: group.facebookuid
      })
      group.busy = false
      group.actioned = true
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
    }
  }
}
</script>
