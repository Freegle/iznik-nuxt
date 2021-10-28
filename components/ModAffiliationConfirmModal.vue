<template>
  <div>
    <b-modal
      v-if="group"
      id="modAffiliationModal"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        Please confirm affiliation for {{ group.nameshort }}
      </template>
      <template slot="default">
        <p>
          At the 2016 Freegle AGM, we voted that each local group should confirm once a year that it still
          wants to be affiliated with Freegle nationally.
        </p>
        <p>
          You might like to review the
          <!-- eslint-disable-next-line -->
          <ExternalLink href="http://wiki.ilovefreegle.org/Basic_Requirements_of_a_Freegle_Group#Affiliation_Requirements">Basic Requirements of a Freegle group</ExternalLink>
          and
          <!-- eslint-disable-next-line -->
          <ExternalLink href="http://wiki.ilovefreegle.org/Freegle_Volunteer_Agreement">Freegle Volunteer Agreement</ExternalLink>.
        </p>
        <p>
          Any moderator on the group can do this, even a backup mod, but if you need to discuss it with your other
          mods then you can click <em>Not now</em> and we'll ask you again tomorrow.
        </p>
        <p>
          If your group no longer wishes to be affiliated with Freegle, please mail
          <!-- eslint-disable-next-line -->
          <ExternalLink href="mailto:board@ilovefreegle.org">board@ilovefreegle.org</ExternalLink>.
        </p>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="secondary" @click="cancel">
          Not now
        </b-button>
        <b-button variant="primary" @click="confirm">
          Yes, we still want to be affiliated
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import ExternalLink from '~/components/ExternalLink'

export default {
  components: { ExternalLink },
  mixins: [modal],
  props: {
    groupid: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {}
  },
  computed: {
    group() {
      return this.$store.getters['auth/groupById'](this.groupid)
    }
  },
  methods: {
    async confirm() {
      await this.$store.dispatch('group/confirmAffiliation', {
        id: this.groupid
      })
      this.hide()
    }
  }
}
</script>
