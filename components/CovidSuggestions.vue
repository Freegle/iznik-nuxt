<template>
  <div>
    <h3>People who may help</h3>
    <p>Here are some people near you who have offered to help.</p>
    <NoticeMessage variant="warning" class="mb-2">
      Freegle hasn't vetted these people - we're just putting you in touch.  Make sure you're safe.
    </NoticeMessage>
    <p>
      Here's some advice.
    </p>
    <ul>
      <li>
        Message them through here, and/or speak to them by phone.  Make sure you
        feel comfortable with them before giving them your address.
      </li>
      <li>
        Don't let someone come to your home if you don't feel right about it.
      </li>
      <li>
        Avoid close contact - either of you might be infectious.
      </li>
      <li>
        Don't worry if you don't want to open the door.  Nobody will take offence.
      </li>
      <li>
        If someone is shopping for you, arrange to pay them by bank transfer if possible.  Don't feel
        pressured to hand over cash if it doesn't feel right.
      </li>
    </ul>
    <p>
      Just common sense, really, and most freeglers are lovely.
    </p>
    <div v-for="helper in helpers" :key="'helper-' + helper.id">
      <b-card v-if="helper.selected" no-body>
        <b-card-body>
          <div class="d-flex">
            <ProfileImage :image="helper.profile.url" size="xl" class="mr-2" />
            <div class="w-100">
              <b>{{ helper.displayname }}</b> {{ (Math.round(helper.distance * 10) / 10) | pluralize('mile', { includeNumber: true }) }} away
              <br>
              {{ helper.covid.intro }}
              <br>
              <div class="d-flex mt-1 justify-content-between">
                <ChatButton
                  :userid="helper.id"
                  size="sm"
                  title="Message them"
                  variant="white"
                  class="mr-2"
                />
                <div>
                  <div v-if="helper.covid.phone">
                    Phone: <b>{{ helper.covid.phone }}</b>
                  </div>
                  <div v-else>
                    <em>No phone number</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </div>
    <p class="mt-2">
      You may also be able to find local support through
      <a href="https://covidmutualaid.org/local-groups/" target="_blank" rel="noopener noreferrer">COVID-19 Mutual Aid UK.</a>.
      We hope to be able to pull local information from them automatically soon.
    </p>
    <p>
      Stay well, and wash your hands.
    </p>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import ProfileImage from './ProfileImage'
import ChatButton from './ChatButton'

export default {
  components: { ChatButton, ProfileImage, NoticeMessage },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    covid() {
      return this.$store.getters['covid/get'](this.id)
    },
    helpers() {
      return this.covid.helpers ? Object.values(this.covid.helpers) : []
    },
    suggestedHelpers() {
      return this.helpers.filter(h => h.selected)
    }
  },
  mounted() {
    this.$store.dispatch('covid/fetch', {
      id: this.id
    })
  }
}
</script>
