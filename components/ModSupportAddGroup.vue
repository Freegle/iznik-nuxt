<template>
  <div>
    <p>
      This lets you add a new Freegle group.
      This will be added with you as an Owner.  It will be set not to be published.
    </p>
    <NoticeMessage variant="warning" class="mb-2">
      We don't check whether this overlaps with other existing groups, or do much verification on the inputs.
      Be careful!
    </NoticeMessage>
    <b-form-group>
      <b-form-text>
        Short name:
      </b-form-text>
      <b-input v-model="nameshort" placeholder="e.g. EdinburghFreegle.  No spaces.  Keep it short." />
    </b-form-group>
    <b-form-group>
      <b-form-text>
        Full name:
      </b-form-text>
      <b-input v-model="namefull" placeholder="e.g. Edinburgh Freegle.  Spaces ok.  Not too long." />
    </b-form-group>
    <b-form-group>
      <b-form-text>
        Centre of group:
      </b-form-text>
      <b-row>
        <b-col cols="6">
          <b-input v-model="lat" type="number" placeholder="Latitude" />
        </b-col>
        <b-col cols="6">
          <b-input v-model="lng" type="number" placeholder="Longitude" />
        </b-col>
      </b-row>
    </b-form-group>
    <b-form-group>
      <b-form-text>
        Core Group Area.  Draw with
        <ExternalLink href="https://arthur-e.github.io/Wicket/sandbox-gmaps3.html">
          this.
        </ExternalLink>
      </b-form-text>
      <b-textarea v-model="cga" rows="5" placeholder="Core Group Area (WKT format)" />
    </b-form-group>
    <b-form-group>
      <b-form-text>
        Default Posting Area (or empty).
      </b-form-text>
      <b-textarea v-model="dpa" rows="5" placeholder="Default Posting Area (WKT format)" />
    </b-form-group>
    <SpinButton
      variant="success"
      name="save"
      label="Add Group"
      spinclass="text-white"
      :handler="add"
      :disabled="!valid"
    />
  </div>
</template>
<script>
import SpinButton from './SpinButton'
import NoticeMessage from './NoticeMessage'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: {
    NoticeMessage,
    SpinButton,
    ExternalLink
  },
  data: function() {
    return {
      nameshort: null,
      namefull: null,
      lat: null,
      lng: null,
      cga: null,
      dpa: null
    }
  },
  computed: {
    valid() {
      return this.nameshort && this.namefull && this.lat && this.lng && this.cga
    }
  },
  methods: {
    async add() {
      await this.$store.dispatch('group/add', {
        nameshort: this.nameshort,
        namefull: this.namefull,
        cga: this.cga,
        dpa: this.dpa,
        lat: this.lat,
        lng: this.lng
      })
    }
  }
}
</script>
