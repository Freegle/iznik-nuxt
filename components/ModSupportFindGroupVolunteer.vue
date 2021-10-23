<template>
  <b-row>
    <b-col cols="4" md="2" class="order-1 ">
      <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ volunteer.userid }}
    </b-col>
    <b-col cols="12" md="3" class="order-4 order-md-2">
      {{ volunteer.displayname }}
      <span v-if="active" class="font-weight-bold">
        (Active)
      </span>
      <span v-else class="text-muted">
        (Backup)
      </span>
    </b-col>
    <b-col cols="12" md="3" class="order-5 order-md-3">
      <Clipboard class="mr-3" :value="volunteer.email" />
      <!-- eslint-disable-next-line -->
      <ExternalLink :href="'mailto:' + volunteer.email">{{ volunteer.email }}</ExternalLink>
    </b-col>
    <b-col cols="4" md="2" class="order-2 order-md-4">
      <ModRole :userid="volunteer.userid" :groupid="groupid" :role="volunteer.role" />
    </b-col>
    <b-col cols="4" md="2" class="order-3 order-md-5">
      <span v-if="volunteer.lastmoderated">
        {{ timeago(volunteer.lastmoderated) }}
      </span>
    </b-col>
  </b-row>
</template>
<script>
import ModRole from './ModRole'
import Clipboard from './Clipboard'
const ExternalLink = () => import('~/components/ExternalLink')
export default {
  components: { Clipboard, ModRole, ExternalLink },
  props: {
    volunteer: {
      type: Object,
      required: true
    },
    groupid: {
      type: Number,
      required: true
    }
  },
  computed: {
    active() {
      console.log(this.volunteer.displayname, this.volunteer.settings.active)
      if (
        this.volunteer &&
        this.volunteer.settings &&
        (this.volunteer.settings.active ||
          !('active' in this.volunteer.settings))
      ) {
        return true
      }

      return false
    }
  }
}
</script>
