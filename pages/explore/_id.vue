<template>
  <div v-if="group">
    <b-card bg-light>
      <b-row v-if="group.profile">
        <b-col cols="1">
          <b-img rounded thumbnail alt="Community profile picture" :src="group.profile" class="js-pageimage" />
        </b-col>
        <b-col>
          <b-card-title>{{ group.namedisplay }}</b-card-title>
          <b-card-sub-title>{{ group.tagline }}</b-card-sub-title>
          <b-button v-if="!amAMember" class="mt-1" variant="success">
            <fa icon="plus" />&nbsp;Join
          </b-button>
          <b-button v-if="amAMember" class="mt-1" variant="white">
            <fa icon="trash-alt" />&nbsp;Leave
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: null,
      group: null,
      messages: null,
      amAMember: false
    }
  },
  async asyncData({ app, params, store }) {
    // We have the group id or name in params.id.  Fetch the group.
    await store.dispatch('group/fetch', {
      id: params.id
    })

    const group = store.getters['group/get'](params.id)
    console.log('Got group', group.nameshort)
    return {
      group: group
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
