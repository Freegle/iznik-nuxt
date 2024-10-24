<template>
  <b-card v-if="someleft" no-body>
    <b-card-header>
      <div class="d-flex justify-content-between">
        <div>
          Share to community Facebook pages
        </div>
        <div class="small text-muted">
          {{ timeago(item.date) }}
        </div>
      </div>
    </b-card-header>
    <!-- eslint-disable-next-line-->
    <b-card-body>
      <ExternalLink v-if="appLink" class="btn btn-white mb-2" :href="appLink">Open in Facebook</ExternalLink>
    </b-card-body>
    <b-card-footer :key="'sharelist-' + actioned.length">
      <b-btn variant="white" class="mb-1 mr-1" @click="shareAll">
        <v-icon name="share-alt" />
        Share all
      </b-btn>
      <b-btn v-for="group in groups"
             :key="'socialaction-' + group.id"
             :variant="isActioned(group.id) ? 'white' : 'primary'"
             class="mb-1 mr-1"
             :disabled="isActioned(group.id)"
             @click="share(group)">
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
import ExternalLink from './ExternalLink'
import cloneDeep from 'lodash.clonedeep'

export default {
  components: { ExternalLink },
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
    appLink() { // Double extract from <iframe src="" ...></iframe>  https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F134117207097%2Fposts%2F951769713651342%2F&width=auto&show_text=true&appId=115376591981611&height=500
      try {
        let applink = this.item.iframe
        let pos = applink.indexOf('src="')
        if (pos !== -1) {
          applink = applink.substring(pos + 5)
          pos = applink.indexOf('"')
          if (pos !== -1) {
            applink = applink.substring(0, pos)
            pos = applink.indexOf('href=')
            if (pos !== -1) {
              applink = applink.substring(pos + 5)
              pos = applink.indexOf('&')
              if (pos !== -1) {
                applink = applink.substring(0, pos)
                applink = decodeURIComponent(applink)
                return applink
              }
            }
          }
        }
      } catch (e) {
        console.log('applinkY', e.message)
      }
      return false
    },
    groups() {
      const ret = []

      // Cloning to avoid some strange issues which cause loops.
      const groups = cloneDeep(this.myGroups)

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
    async hide(group, noUpdate) {
      this.busy.push(group.id)

      await this.$store.dispatch('publicity/hide', {
        id: this.item.id,
        uid: group.facebookuid
      })

      this.busy = this.busy.filter(g => {
        return g.id !== group.id
      })

      this.actioned.push(group.id)

      if (!noUpdate) {
        this.updateWork()
      }
    },
    async shareAll() {
      const promises = []

      this.groups.forEach(group => {
        if (this.actioned.indexOf(group.id) === -1) {
          promises.push(this.share(group, false))
        }
      })

      await Promise.all(promises)

      this.updateWork()
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
    },
    updateWork() {
      this.fetchMe(['work'])
    }
  }
}
</script>
