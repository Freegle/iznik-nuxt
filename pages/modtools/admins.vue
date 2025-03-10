<template>
  <div>
    <div>
      <div>
        <ModHelpAdmins />
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
            <validating-form>
              <b-form-group
                label="Subject of ADMIN:"
                label-for="subject"
                label-class="mb-0"
              >
                <p>
                  ADMINs come in two flavours:
                  <ul>
                    <li>
                      Essential - everyone must receive them.  These are important announcements about the running
                      of the group.
                    </li>
                    <li>
                      Newsletter - people can opt out (via the setting which mentions "to remind you").  These
                      are less important or encouragements to freegle more.
                    </li>
                  </ul>
                </p>
                <OurToggle
                  v-model="essential"
                  class="mt-2"
                  :height="30"
                  :width="150"
                  :font-size="14"
                  :sync="true"
                  :labels="{checked: 'Essential', unchecked: 'Newsletter'}"
                  color="#61AE24"
                />
              </b-form-group>
              <b-form-group
                label="Subject of ADMIN:"
                label-for="subject"
                label-class="mb-0"
              >
                <validating-form-input
                  id="subject"
                  v-model="subject"
                  class="mb-3"
                  type="text"
                  placeholder="Subject (don't include ADMIN - added automatically)"
                  :validation="$v.subject"
                  :validation-enabled="validationEnabled"
                  :validation-messages="{
                    required: 'Please add a subject'
                  }"
                />
              </b-form-group>
              <b-form-group
                label="Body of ADMIN:"
                label-for="body"
                label-class="mb-0"
              >
                <validating-textarea
                  id="body"
                  v-model="body"
                  rows="15"
                  max-rows="8"
                  spellcheck="true"
                  placeholder="Put your message in here.  Plain-text only."
                  class="mb-3"
                  :validation="$v.body"
                  :validation-enabled="validationEnabled"
                  :validation-messages="{
                    required: 'Please add the message'
                  }"
                />
              </b-form-group>
              <p>
                You can optionally add a big button into the ADMIN, and specify where it will go.
              </p>
              <b-form-group
                label="Call To Action text:"
                label-for="ctatext"
                label-class="mb-0"
              >
                <b-form-input
                  id="ctatext"
                  v-model="ctatext"
                  class="mb-3"
                  placeholder="(Option) Text for a big button"
                />
              </b-form-group>
              <b-form-group
                label="Call To Action link:"
                label-for="ctalink"
                label-class="mb-0"
              >
                <b-form-input
                  id="ctalink"
                  v-model="ctalink"
                  class="mb-3"
                  placeholder="(Optional) Link for a big button"
                />
              </b-form-group>
            </validating-form>
            <b-btn class="mt-2 mb-2" size="lg" :variant="groupidcreate < 0 ? 'danger' : 'primary'" :disabled="groupidcreate <= 0 && groupidcreate !== -2" @click="create">
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
            <GroupSelect v-model="groupidprevious" modonly class="mb-2" />
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
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import loginRequired from '@/mixins/loginRequired.js'
import validationHelpers from '@/mixins/validationHelpers'
import NoticeMessage from '../../components/NoticeMessage'
import ModAdmin from '../../components/ModAdmin'
import GroupSelect from '../../components/GroupSelect'
import ValidatingForm from '~/components/ValidatingForm'
import ValidatingFormInput from '~/components/ValidatingFormInput'
import ValidatingTextarea from '~/components/ValidatingTextarea'
import ModHelpAdmins from '~/components/ModHelpAdmins'
const OurToggle = () => import('~/components/OurToggle')

const noAdmin = val => {
  return !!(val && val.toLowerCase().indexOf('admin') === -1)
}

export default {
  components: {
    ModHelpAdmins,
    NoticeMessage,
    ModAdmin,
    GroupSelect,
    ValidatingForm,
    ValidatingFormInput,
    ValidatingTextarea,
    OurToggle
  },
  mixins: [validationMixin, validationHelpers, loginRequired],
  data: function() {
    return {
      groupidshow: null,
      groupidcreate: null,
      groupidprevious: null,
      subject: null,
      body: null,
      ctatext: null,
      ctalink: null,
      creating: false,
      created: false,
      essential: true
    }
  },
  computed: {
    pendingcount() {
      let count = 0

      for (const group of this.myGroups) {
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
      this.$v.$touch()

      if (this.$v.$anyError) {
        this.validationFocusFirstError()
        return
      }

      this.creating = true

      // Don't allow CTA link/text without the other.
      if ((this.ctatext && this.ctalink) || (!this.ctatext && !this.ctalink)) {
        await this.$api.admins.add({
          groupid: this.groupidcreate > 0 ? this.groupidcreate : null,
          subject: this.subject,
          text: this.body,
          ctatext: this.ctatext,
          ctalink: this.ctalink,
          essential: this.essential
        })

        this.creating = false
        this.created = true

        setTimeout(() => {
          this.created = false
        }, 2000)

        this.fetchMe(['work'])
      }
    },
    async fetch(groupid) {
      await this.$store.dispatch('admins/clear')
      await this.$store.dispatch('admins/fetch', {
        groupid: groupid
      })
    }
  },
  validations: {
    body: {
      required
    },
    subject: {
      required,
      noAdmin
    }
  }
}
</script>
