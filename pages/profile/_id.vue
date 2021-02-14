<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" class="d-none d-md-block" />
    <b-col cols="12" md="6" class="p-0">
      <ProfileInfo :id="id" />
    </b-col>
  </b-row>
</template>

<script>
import loginOptional from '@/mixins/loginOptional.js'
import ProfileInfo from '@/components/ProfileInfo'

export default {
  components: {
    ProfileInfo
  },
  mixins: [loginOptional],
  props: {},
  data: function() {
    return {
      id: null
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id)
  }
}
</script>
