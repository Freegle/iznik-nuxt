<template>
  <b-card v-if="someleft" no-body>
    <b-card-header>
      Share to community Facebook pages
    </b-card-header>
    <!-- eslint-disable-next-line-->
    <b-card-body v-html="item.iframe" />
    <b-card-footer :key="'sharelist-' + shared.length">
      <!--      TODO Share/hide all buttons-->
      <b-btn variant="success" class="mb-1 mr-1" disabled>
        <v-icon name="share-alt" />
        Share all
      </b-btn>
      <b-btn
        v-for="group in groups"
        :key="'socialaction-' + group.id"
        :variant="group.shared ? 'white' : 'primary'"
        class="mb-1 mr-1"
        :disabled="group.shared"
        @click="share(group)"
      >
        <v-icon v-if="group.sharing" name="sync" class="fa-spin" />
        <v-icon v-else-if="group.shared" name="check" />
        <v-icon v-else name="share-alt" />
        {{ group.namedisplay }}
      </b-btn>
      <b-btn variant="danger" class="mb-1 mr-1" disabled>
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
      shared: []
    }
  },
  computed: {
    groups() {
      const ret = []

      const groups = this.$store.getters['auth/groups']

      this.item.uids.forEach(uid => {
        for (const group of groups) {
          if (group.type === 'Freegle' && group.facebook) {
            if (this.shared.indexOf(group.id) !== -1) {
              group.shared = true
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
        if (!group.shared) {
          ret = true
        }
      })

      console.log('Some left?', ret)
      return ret
    }
  },
  methods: {
    async share(group) {
      console.log('Share', group)
      this.shared.push(group.id)
      group.sharing = true
      await this.$store.dispatch('publicity/share', {
        id: this.item.id,
        uid: group.facebookuid
      })
      group.sharing = false
      group.shared = true
      console.log('Shared')
    }
  }
}
</script>
