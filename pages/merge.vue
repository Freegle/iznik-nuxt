<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6" class="bg-white">
        <NoticeMessage v-if="invalid" variant="danger">
          <p>That request isn't valid.  Perhaps you've already merged?  Or maybe clicked on the wrong link.</p>
          <p>
            If you continue to have problems, please contact our support volunteers at
            <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a>
          </p>
        </NoticeMessage>
        <div v-else-if="merge">
          <h1>Merge accounts</h1>
          <p>
            We think you have two Freegle accounts.
          </p>
          <ul>
            <li>
              <!-- eslint-disable-next-line-->
              <b>{{ merge.user1.name }} <span v-if="merge.user1.email">({{ merge.user1.email }})</span></b>.
              You have signed in to this with {{ u1logins }}.
            </li>
            <li>
              <!-- eslint-disable-next-line-->
              <b>{{ merge.user2.name }} <span v-if="merge.user2.email">({{ merge.user2.email }})</span></b>.
              You have signed in to this with {{ u2logins }}.
            </li>
          </ul>
          <div v-if="rejected">
            <NoticeMessage variant="info" class="mb-2">
              Ok, we'll keep them separate.  Thanks for letting us know.
            </NoticeMessage>
            <p>
              You can close this page now, or:
            </p>
            <b-btn size="lg" to="/" variant="primary" class="mb-2">
              Continue
            </b-btn>
          </div>
          <div v-else-if="!merging">
            <p>This can cause you to miss messages.</p>
            <p>Would you like to combine them into a single account?</p>
            <div class="d-flex justify-content-between mb-2">
              <b-btn variant="primary" @click="mergeit">
                Yes please
              </b-btn>
              <b-btn variant="warning" @click="reject">
                No thanks
              </b-btn>
            </div>
          </div>
          <div v-else>
            <hr>
            <p>Ok, let's merge them.  We need to know which email address you prefer.</p>
            <p>This is my main email address:</p>
            <b-select v-model="preferred" class="mt-1 mb-1">
              <option :value="null">
                -- Please choose --
              </option>
              <option :value="merge.user1.id">
                {{ merge.user1.email }}
              </option>
              <option :value="merge.user2.id">
                {{ merge.user2.email }}
              </option>
            </b-select>
            <b-btn v-if="preferred" class="mt-2" variant="primary" size="lg" @click="combine">
              Combine my accounts
              <v-icon v-if="mergeInProgress" name="sync" class="fa-spin" />
              <v-icon v-else-if="mergeComplete" name="check" class="text-success" />
              <v-icon v-else name="angle-double-right" />
            </b-btn>
            <div v-if="mergeComplete">
              <hr>
              <p>
                You can close this page now, or:
              </p>
              <b-btn size="lg" to="/" variant="primary" class="mb-2">
                Continue
              </b-btn>
            </div>
            <hr>
            <p>
              If you have problems or questions, please contact our support volunteers at
              <a href="mailto:geeks@ilovefreegle.org">geeks@ilovefreegle.org</a>
            </p>
          </div>
        </div>
      </b-col>
    </b-row>.
  </div>
</template>
<script>
import NoticeMessage from '@/components/NoticeMessage'
import loginOptional from '@/mixins/loginOptional.js'

export default {
  components: {
    NoticeMessage
  },
  mixins: [loginOptional],
  data: function() {
    return {
      id: null,
      uid: null,
      invalid: false,
      merging: false,
      rejected: false,
      merge: null,
      preferred: null,
      mergeInProgress: false,
      mergeComplete: false
    }
  },
  computed: {
    u1logins() {
      return this.logins(this.merge.user1)
    },
    u2logins() {
      return this.logins(this.merge.user2)
    }
  },
  async mounted() {
    // Get the merge request.
    const ret = await this.$api.merge.fetch({
      id: this.id,
      uid: this.uid
    })

    if (!ret.id || !ret.user1 || !ret.user2 || !ret.user1.id || !ret.user2.id) {
      this.invalid = true
    }

    this.merge = ret
  },
  created() {
    this.id = this.$route.query.id
    this.uid = this.$route.query.uid
  },
  methods: {
    logins(user) {
      const ret = []

      user.logins.forEach(login => {
        switch (login.type) {
          case 'Native': {
            ret.push('Email/Password')
            break
          }
          case 'Facebook': {
            ret.push('Facebook')
            break
          }
          case 'Yahoo': {
            ret.push('Yahoo')
            break
          }
          case 'Google': {
            ret.push('Google')
            break
          }
        }
      })

      return [...new Set(ret)].join(', ')
    },

    mergeit() {
      this.merging = true
    },

    reject() {
      this.rejected = true

      this.$api.merge.reject({
        id: this.id,
        uid: this.uid,
        user1: this.preferred,
        user2:
          this.preferred === this.merge.user1.id
            ? this.merge.user2.id
            : this.merge.user1.id
      })
    },

    async combine() {
      this.mergeInProgress = true

      await this.$api.merge.accept({
        id: this.id,
        uid: this.uid,
        user1: this.preferred,
        user2:
          this.preferred === this.merge.user1.id
            ? this.merge.user2.id
            : this.merge.user1.id
      })

      this.mergeInProgress = false
      this.mergeComplete = true
    }
  }
}
</script>
