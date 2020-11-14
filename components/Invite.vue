<template>
  <div>
    <div v-if="!contacts">
      <b-btn variant="primary" size="lg" @click="getContacts">
        Invite your friends
      </b-btn>
      <p class="mt-2 small">
        It'll ask for access to your contacts.  <b>Don't worry</b> - this doesn't mean we can access all of
        them!  You choose which ones to invite.  We don't pass this information to our servers, we don't
        store it, and we can't access it in future.  You're in control.
      </p>
    </div>
    <div v-else>
      <label for="invitation">
        <b>Personalise your invitation message:</b>
      </label>
      <b-textarea
        id="invitation"
        v-model="invitation"
        maxlength="160"
        rows="2"
        placeholder="Tell your friends why they should get freegling!"
        class="mt-2 mb-2 border border-primary"
      />
      <div v-if="emails.length" class="mt-2">
        <component :is="headingLevel">
          Invite by email
        </component>
        <ExternalLink v-for="email in emails" :key="'email-' + email" :href="'mailto:' + email + '?subject=Have you tried Freegle%3F&body=' + encodeURIComponent(invitation)" class="mb-1 mr-1">
          <b-btn variant="primary">
            <v-icon name="envelope" /> {{ email.email }}
          </b-btn>
        </ExternalLink>
      </div>
      <div v-if="phones.length" class="mt-2">
        <component :is="headingLevel">
          Invite by WhatsApp
        </component>
        <ExternalLink v-for="phone in phones" :key="'phone-' + phone.phone" :href="'whatsapp://send?phone=' + phone.phone + '&text=' + encodeURIComponent(invitation)">
          <b-btn variant="primary" class="mb-1 mr-1">
            <v-icon name="brands/whatsapp" /> {{ phone.name }} <span class="small"><span class="small">{{ phone.phone }}</span></span>
          </b-btn>
        </ExternalLink>
        <component :is="headingLevel">
          Invite by text (SMS)
        </component>
        <ExternalLink v-for="phone in phones" :key="'sms-' + phone.phone" :href="'sms://' + phone.phone + '?body=' + encodeURIComponent(invitation)">
          <b-btn variant="primary" class="mb-1 mr-1">
            <v-icon name="sms" /> {{ phone.name }} <span class="small"><span class="small">{{ phone.phone }}</span></span>
          </b-btn>
        </ExternalLink>
      </div>
    </div>
  </div>
</template>
<script>
import ExternalLink from './ExternalLink'
export default {
  components: { ExternalLink },
  props: {
    headingLevel: {
      type: String,
      required: false,
      default: 'h3'
    }
  },
  data: function() {
    return {
      contacts: null,
      invitation:
        "Hi - I'm using Freegle to give and get things for free.  Check it out at https://www.ilovefreegle.org"
    }
  },
  computed: {
    emails() {
      const ret = []

      if (this.contacts) {
        this.contacts.forEach(c => {
          if (c.email) {
            c.email.forEach(e => {
              ret.push({
                name: c.name ? c.name[0] : null,
                email: e
              })
            })
          }
        })
      }

      return ret
    },
    phones() {
      const ret = []

      if (this.contacts) {
        this.contacts.forEach(c => {
          if (c.tel) {
            c.tel.forEach(e => {
              ret.push({
                name: c.name ? c.name[0] : null,
                phone: e
              })
            })
          }
        })
      }

      return ret
    }
  },
  mounted() {
    this.$api.bandit.shown({
      uid: 'invitation',
      variant: 'notice'
    })
  },
  methods: {
    async getContacts() {
      this.contacts = await navigator.contacts.select(
        ['name', 'email', 'tel'],
        {
          multiple: true
        }
      )
    }
  }
}
</script>