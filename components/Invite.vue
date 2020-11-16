<template>
  <div>
    <div v-if="!contacts || !contacts.length" class="layout">
      <div>
        <b-btn variant="primary" size="lg" @click="getContacts">
          Invite your friends!
        </b-btn>
      </div>
      <div class="d-flex flex-column justify-content-center">
        <p class="small m-0">
          It'll ask for access to your contacts.  <b>Don't worry</b> - this doesn't mean we can access all of
          them!  You choose which ones to invite.  We don't pass this information to our servers, we don't
          store it, and we can't access it in future.  You're in control.
        </p>
      </div>
    </div>
    <div v-else>
      <label for="invitation">
        <b>Personalise your invitation message:</b>
      </label>
      <b-textarea
        id="invitation"
        v-model="invitation"
        maxlength="160"
        rows="3"
        size="lg"
        placeholder="Tell your friends why they should get freegling!"
        class="mt-2 mb-2 border border-primary"
      />
      <div v-if="phones.length">
        <component :is="headingLevel" class="mt-2">
          Invite by WhatsApp
        </component>
        <ExternalLink v-for="phone in phones" :key="'phone-' + phone.phone" :href="'whatsapp://send?phone=' + phone.phone + '&text=' + encodeURIComponent(invitation)">
          <b-btn variant="primary" class="mb-1 mr-1">
            <v-icon name="brands/whatsapp" /> {{ phone.name }} <span class="small"><span class="small">{{ phone.phone }}</span></span>
          </b-btn>
        </ExternalLink>
        <component :is="headingLevel" class="mt-2">
          Invite by text (SMS)
        </component>
        <ExternalLink v-for="phone in phones" :key="'sms-' + phone.phone" :href="'sms://' + phone.phone + '?body=' + encodeURIComponent(invitation)">
          <b-btn variant="primary" class="mb-1 mr-1">
            <v-icon name="sms" /> {{ phone.name }} <span class="small"><span class="small">{{ phone.phone }}</span></span>
          </b-btn>
        </ExternalLink>
      </div>
      <div v-if="emails.length">
        <component :is="headingLevel" class="mt-2">
          Invite by email
        </component>
        <ExternalLink v-for="email in emails" :key="'email-' + email" :href="'mailto:' + email.email + '?subject=Have you tried Freegle%3F&body=' + encodeURIComponent(invitation)" class="mb-1 mr-1">
          <b-btn variant="primary">
            <v-icon name="envelope" /> {{ email.name }} {{ email.email }}
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
        "Hi - I'm using Freegle to give and get things for free.  Check out their app at https://www.ilovefreegle.org/mobile or on the web at https://www.ilovefreegle.org"
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
          if (c.emails) { // App
            c.emails.forEach(email => {
              ret.push({
                name: c.displayName ? c.displayName + (email.type ? ' ' + email.type : '') : null,
                email: email.value
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
          if (c.phoneNumbers) { // App
            c.phoneNumbers.forEach(phone => {
              ret.push({
                name: c.displayName ? c.displayName + (phone.type ? ' ' + phone.type : '') : null,
                phone: phone.value
              })
            })
          }

        })
      }

      return ret
    }
  },
  watch: {
    contacts(newVal) {
      this.$api.bandit.chosen({
        uid: 'contacts',
        variant: 'contacts'
      })
    }
  },
  mounted() {
    this.$api.bandit.shown({
      uid: 'contacts',
      variant: 'contacts'
    })
  },
  methods: {
    async getContacts() {
      if (process.env.IS_APP) {
        function onError(contactError) {
          console.log('navigator.contacts.find onError!')
        }
        const options = new ContactFindOptions()
        options.multiple = true;
        options.desiredFields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.phoneNumbers]
        navigator.contacts.find(['*'], contacts => { this.contacts = contacts }, onError, options)
        // contact.displayName
        // contact.emails[] value
        // contact.phoneNumbers value
        return
      }
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
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-column-gap: 10px;

  @include media-breakpoint-up(md) {
    grid-template-columns: auto auto;
    grid-template-rows: auto;
  }
}
</style>
