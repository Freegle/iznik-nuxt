<template>
  <div>
    <p>
      About once a month, we will randomly select one member of Freegle's national organisation (Freegle Ltd) to
      receive a surprise cake as a thank you.  If you don't want the cake yourself, you are of course welcome to
      freegle it on your group - which could be good publicity!
    </p>
    <p>
      If you haven't signed up as an official member of Freegle Ltd then why not join now?
      You might get cake, and
      you will be able to take part in votes on our future and demonstrate your support.  Find out more
      <!-- eslint-disable-next-line -->
      <external-link href="https://wiki.ilovefreegle.org/Freegle_Ltd_Membership">on the wiki</external-link>
      or
      <!-- eslint-disable-next-line -->
      <external-link href="http://freegle.in/JoinFreegleLtd">join here</external-link>.
    </p>
    <p>
      If you want cake, please click this button to change it to green.  Most of us love cake, but if for any
      reason you'd prefer us not to send you any, just ignore this.
    </p>
    <OurToggle
      v-model="modcake"
      class="mt-2"
      :height="30"
      :width="150"
      :font-size="14"
      :sync="true"
      :labels="{checked: 'Cake please', unchecked: 'No cake thanks'}"
      color="#61AE24"
    />
    <div v-if="modcake">
      <p>
        If you have specific dietary
        requirements (e.g. vegan, gluten free,
        citrus fruit allergy etc.) please let us know here.
      </p>
      <b-textarea v-model="cakenotes" placeholder="Any dietary requirements." rows="3" class="mt-2" />
      <SpinButton name="save" label="Save notes" variant="primary" class="mt-2" :handler="saveNotes" />
    </div>
  </div>
</template>
<script>
import ExternalLink from '@/components/ExternalLink'
import SpinButton from '@/components/SpinButton'
const OurToggle = () => import('@/components/OurToggle')

export default {
  components: { SpinButton, OurToggle, ExternalLink },
  data: function() {
    return {
      notes: null
    }
  },
  computed: {
    modcake: {
      get() {
        return Object.keys(this.me.settings).includes('modcake')
          ? this.me.settings.modcake
          : false
      },
      set(newval) {
        this.saveSetting('modcake', newval)
      }
    },
    cakenotes: {
      get() {
        return Object.keys(this.me.settings).includes('modcakenotes')
          ? this.me.settings.modcakenotes
          : null
      },
      set(newval) {
        this.notes = newval
      }
    }
  },
  methods: {
    async saveSetting(name, val) {
      const settings = this.me.settings
      settings[name] = val
      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    },
    saveNotes() {
      this.saveSetting('modcakenotes', this.notes)
    }
  }
}
</script>
