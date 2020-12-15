<template>
  <div>
    <h5 class="text-center">
      It looks like this is your first time freegling.  Hello!
    </h5>
    <b-card variant="white">
      <h2 class="text-center">
        Your Account Password
      </h2>
      <p class="text-center">
        We've emailed a password to you:
      </p>
      <div class="d-flex justify-content-around">
        <b-card variant="white">
          <h1 class="text-primary">
            <span class="large">
              {{ password }}
            </span>
          </h1>
        </b-card>
      </div>
      <p class="text-center mt-2">
        ...or you can set your own:
      </p>
      <div class="d-flex justify-content-around">
        <b-input-group>
          <b-form-input v-model="newPassword" type="password" />
          <b-input-group-append>
            <SpinButton variant="secondary" :handler="setPassword" name="save" label="Save" />
          </b-input-group-append>
        </b-input-group>
      </div>
      <p class="mt-2 text-center text-muted">
        You can also log in later with your Facebook, Google or Yahoo account for that email address if you have one.
      </p>
    </b-card>
    <b-card v-if="me" variant="white">
      <h2 class="text-center">
        How often do you want emails?
      </h2>
      <p class="text-center">
        We'll email you OFFERs and WANTEDs from other freeglers.  How often do you want them?
      </p>
      <div class="d-flex flex-wrap justify-content-between">
        <b-btn :variant="frequencyChosen(24)" @click="emails(24)">
          Daily
        </b-btn>
        <b-btn :variant="frequencyChosen(12)" @click="emails(12)">
          12 hours
        </b-btn>
        <b-btn :variant="frequencyChosen(4)" @click="emails(4)">
          4 hours
        </b-btn>
        <b-btn :variant="frequencyChosen(2)" @click="emails(2)">
          2 hours
        </b-btn>
        <b-btn :variant="frequencyChosen(1)" @click="emails(1)">
          1 hour
        </b-btn>
        <b-btn :variant="frequencyChosen(0)" @click="emails(0)">
          Immediately
        </b-btn>
        <b-btn :variant="frequencyChosen(-1)" @click="emails(-1)">
          Never
        </b-btn>
      </div>
    </b-card>
  </div>
</template>
<script>
import SpinButton from './SpinButton'
export default {
  components: { SpinButton },
  props: {
    password: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      newPassword: null,
      emailFrequency: null
    }
  },
  mounted() {
    this.$store.dispatch('auth/fetchUser', {
      components: ['me', 'groups']
    })
  },
  methods: {
    async setPassword() {
      this.savingPassword = true

      if (this.newPassword) {
        this.me = await this.$store.dispatch('auth/saveAndGet', {
          password: this.newPassword
        })
      }

      this.savingPassword = false
      this.savedPassword = true
      setTimeout(() => {
        this.savedPassword = false
      }, 2000)
    },
    async emails(frequency) {
      this.$api.bandit.chosen({
        uid: 'newuser-email-frequency',
        variant: frequency
      })

      for (const group of this.me.groups) {
        if (group.type === 'Freegle') {
          await this.$store.dispatch('auth/setGroup', {
            userid: this.me.id,
            groupid: group.id,
            emailfrequency: frequency
          })
        }
      }

      await this.$store.dispatch('auth/fetchUser', {
        components: ['me', 'groups']
      })

      this.emailFrequency = frequency
    },
    frequencyChosen(freq) {
      return this.emailFrequency === freq ? 'primary' : 'secondary'
    }
  }
}
</script>
