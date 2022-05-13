<template>
  <b-row class="mb-2">
    <b-col cols="4">
      <ProfileImage
        :image="member.profile.turl"
        class="mr-2"
        size="lg"
      />
    </b-col>
    <b-col cols="6">
      <strong>{{ member.displayname }}</strong>
      <span class="text-faded small">
        <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ member.id }}
      </span>
    </b-col>
    <b-col>
      <b-btn v-if="supportOrAdmin" size="sm" variant="white" @click="remove">
        <v-icon name="trash-alt" />
      </b-btn>
    </b-col>
  </b-row>
</template>
<script>
import ProfileImage from './ProfileImage'
export default {
  components: { ProfileImage },
  props: {
    teamid: {
      type: Number,
      required: true
    },
    member: {
      type: Object,
      required: true
    }
  },
  methods: {
    remove() {
      console.log('Remove', this.teamid, this.member.id)
      this.$store.dispatch('team/remove', {
        id: this.teamid,
        userid: this.member.id
      })
    }
  }
}
</script>
<style scoped>
.max {
  max-width: 145px;
}
</style>
