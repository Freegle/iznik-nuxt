<template>
  <div>
    <div>
      <v-icon name="check" class="text-success" /> Linked to
      <a :href="'https://facebook.com/' + facebook.id">{{ facebook.name }}</a>
      <span class="text-muted small">
        {{ facebook.authdate | dateshort }}
      </span>
    </div>
    <b-btn variant="white" class="mt-1" @click="unlink">
      <v-icon name="trash-alt" /> Unlink
    </b-btn>
  </div>
</template>
<script>
export default {
  props: {
    groupid: {
      type: Number,
      required: true
    },
    facebook: {
      type: Object,
      required: true
    }
  },
  methods: {
    async unlink() {
      await this.$store.dispatch('group/removeFacebook', {
        uid: this.facebook.uid,
        groupid: this.groupid
      })
    }
  }
}
</script>
