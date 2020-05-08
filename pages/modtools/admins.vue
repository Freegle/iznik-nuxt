<template>
  <div>
    <div>
      <div>
        <b-tabs content-class="mt-3" card>
          <b-tab active @click="fetchPending">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Pending
                <b-badge v-if="pendingcount" variant="danger">
                  {{ pendingcount }}
                </b-badge>
              </h2>
            </template>
            <GroupSelect v-model="groupidshow" all modonly :work="['pendingadmins']" class="mb-2" />
            <div v-if="pending.length">
              <ModAdmin v-for="admin in pending" :id="admin.id" :key="'pendingadmin-' + admin.id" :open="pending.length === 1" />
            </div>
            <div v-else>
              No ADMINs to review just now.
            </div>
          </b-tab>
          <b-tab>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Create
              </h2>
            </template>
            <GroupSelect v-model="groupidcreate" modonly :systemwide="supportOrAdmin" class="mb-2" />
            <NoticeMessage v-if="groupidcreate < 0" class="mt-1 mb-1" variant="danger">
              This is a suggested ADMIN.  All local communities will get "copies" of this (unless they've opted out),
              and mods can then edit/approve/reject them.  Members won't receive multiple copies.
            </NoticeMessage>
            <b-form-group
              label="Subject of ADMIN:"
              label-for="subject"
              label-class="mb-0"
            >
              <b-form-input
                id="subject"
                v-model="subject"
                class="mb-3"
                placeholder="Subject (don't include ADMIN - added automatically)"
              />
            </b-form-group>
            <b-form-group
              label="Body of ADMIN:"
              label-for="body"
              label-class="mb-0"
            >
              <b-textarea
                id="body"
                v-model="body"
                class="mb-3"
                placeholder="Put your message in here.  Plain-text only."
                rows="15"
              />
            </b-form-group>
            <b-btn class="mt-2 mb-2" size="lg" :variant="groupidcreate < 0 ? 'danger' : 'success'" :disabled="createinvalid" @click="create">
              <v-icon v-if="created" name="check" />
              <v-icon v-else-if="creating" name="sync" class="fa-spin" />
              <v-icon v-else name="save" />
              <span v-if="groupidcreate < 0">
                Send to all communities
              </span>
              <span v-else>
                Send to Pending ADMINs
              </span>
            </b-btn>
            <p>It's a good idea to have a fellow mod take a look at an ADMIN before it goes out, to spot typos.</p>
          </b-tab>
          <b-tab @click="fetchPrevious">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Previous
              </h2>
            </template>
            <GroupSelect v-model="groupidprevious" class="mb-2" />
            <p>
              If an ADMIN shows as queued for send, it usually takes a few minutes.  If we are sending a lot of
              ADMINs it can take a few hours.
            </p>
            <p>
              If a suggested ADMIN doesn't show here it will be because you deleted it.
            </p>
            <div v-if="previous.length">
              <ModAdmin v-for="admin in previous" :id="admin.id" :key="'pendingadmin-' + admin.id" :open="previous.length === 1" />
            </div>
            <div v-else-if="groupidprevious > 0">
              No previous ADMINs.
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import GroupSelect from '../../components/GroupSelect'
import ModAdmin from '../../components/ModAdmin'
import NoticeMessage from '../../components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: { NoticeMessage, ModAdmin, GroupSelect },
  mixins: [loginRequired],
  data: function() {
    return {
      groupidshow: null,
      groupidcreate: null,
      groupidprevious: null,
      subject: null,
      body: null,
      creating: false,
      created: false
    }
  },
  computed: {
    createinvalid() {
      return (
        !this.groupidcreate ||
        !this.subject ||
        this.subject.toLowerCase().indexOf('admin') !== -1 ||
        !this.body
      )
    },
    pendingcount() {
      const myGroups = this.$store.getters['auth/groups']
      let count = 0

      for (const group of myGroups) {
        if (
          group.type === 'Freegle' &&
          (!this.modonly ||
            group.role === 'Owner' ||
            group.role === 'Moderator')
        ) {
          if (group.work && group.work.pendingadmins) {
            count += group.work.pendingadmins
          }
        }
      }

      return count
    },
    pending() {
      return Object.values(this.$store.getters['admins/list'])
        .filter(a => a.pending)
        .sort(function(a, b) {
          return new Date(b.created).getTime() - new Date(a.created).getTime()
        })
    },
    previous() {
      return Object.values(this.$store.getters['admins/list'])
        .filter(a => !a.pending)
        .sort(function(a, b) {
          return new Date(b.created).getTime() - new Date(a.created).getTime()
        })
    }
  },
  layout: 'modtools',
  watch: {
    groupidshow(newval) {
      this.fetch(newval)
    },
    groupidprevious(newval) {
      this.fetch(newval)
    }
  },
  mounted() {
    this.fetch(this.groupidshow)
  },
  methods: {
    fetchPending() {
      this.fetch(this.groupidshow)
    },
    fetchPrevious() {
      this.fetch(this.groupidprevious)
    },
    async create() {
      this.creating = true

      await this.$api.admins.add({
        groupid: this.groupidcreate > 0 ? this.groupidcreate : null,
        subject: this.subject,
        text: this.body
      })

      this.creating = false
      this.created = true

      setTimeout(() => {
        this.created = false
      }, 2000)

      this.$store.dispatch('auth/fetchUser', {
        components: ['work'],
        force: true
      })
    },
    async fetch(groupid) {
      await this.$store.dispatch('admins/clear')
      await this.$store.dispatch('admins/fetch', {
        groupid: groupid
      })
    }
  }
}
</script>
<style scoped>
</style>
