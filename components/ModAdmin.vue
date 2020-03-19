<template>
  <div>
    <b-card no-body>
      <b-card-header class="clickme" @click="expanded = !expanded">
        <b-row>
          <b-col cols="6" md="2">
            <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ admin.id }}
          </b-col>
          <b-col cols="6" md="3">
            {{ admin.created | timeago }}
          </b-col>
          <b-col cols="12" md="4">
            <span v-if="admin.createdby">
              Created by
              {{ admin.createdby.displayname }}
              <span class="text-muted small">
                <v-icon name="hashtag" class="text-muted" scale="0.75" /> {{ admin.createdby.id }}
              </span>
            </span>
          </b-col>
          <b-col cols="12" md="3">
            <span class="d-block float-right">
              <v-icon v-if="!expanded" name="caret-down" />
              <v-icon v-else name="caret-up" />
            </span>
            {{ groupname }}
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body v-if="expanded">
        <b-form-group
          label="Subject of ADMIN:"
          label-for="subject"
          label-class="mb-0"
        >
          <b-form-input
            id="subject"
            v-model="admin.subject"
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
            v-model="admin.text"
            class="mb-3"
            placeholder="Put your message in here.  Plain-text only."
            rows="15"
          />
        </b-form-group>
      </b-card-body>
      <b-card-footer v-if="expanded">
        <b-btn variant="warning" @click="deleteIt">
          <v-icon name="trash-alt" /> Delete
        </b-btn>
        <b-btn variant="primary" @click="save">
          <v-icon v-if="saving" name="sync" class="text-success fa-spin" />
          <v-icon v-else-if="saved" name="check" class="text-success" />
          <v-icon v-else name="save" />
          Save changes
        </b-btn>
        <b-btn variant="success" @click="approve">
          <v-icon name="check" /> Approve and Send
        </b-btn>
      </b-card-footer>
    </b-card>
    <ConfirmModal ref="deleteConfirm" :title="'Delete: ' + admin.subject" @confirm="deleteConfirmed" />
  </div>
</template>
<script>
import ConfirmModal from './ConfirmModal'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: { ConfirmModal },
  mixins: [waitForRef],
  props: {
    id: {
      type: Number,
      required: true
    },
    open: {
      type: Boolean,
      required: false
    }
  },
  data: function() {
    return {
      expanded: false,
      saving: false,
      saved: false
    }
  },
  computed: {
    admin() {
      return this.$store.getters['admins/get'](this.id)
    },
    groupname() {
      let ret = null
      const group = this.$store.getters['auth/groupById'](this.admin.groupid)

      if (group) {
        ret = group.namedisplay
      }

      return ret
    }
  },
  mounted() {
    this.expanded = this.open
  },
  methods: {
    deleteIt() {
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    deleteConfirmed() {
      this.$store.dispatch('admins/delete', {
        id: this.id
      })
    },
    save() {
      this.saving = true

      this.$store.dispatch('admins/edit', {
        id: this.admin.id,
        subject: this.admin.subject,
        text: this.admin.body,
        pending: 1
      })

      this.saving = false
      this.saved = true
      setTimeout(() => {
        this.saved = false
      }, 2000)
    },
    approve() {
      this.$store.dispatch('admins/approve', {
        id: this.admin.id
      })

      this.$store.dispatch('auth/fetchUser', {
        components: ['work'],
        force: true
      })
    }
  }
}
</script>
