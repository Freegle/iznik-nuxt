<template>
  <div>
    <b-badge v-for="l in member.logins" :key="'login-' + l.id" variant="info" class="border border-info rounded p-1 mr-1">
      {{ loginType(l.type) }} login {{ l.lastaccess | timeago }}
    </b-badge>
  </div>
</template>
<script>
export default {
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  methods: {
    loginType(type) {
      let ret = type

      switch (type) {
        case 'Native': {
          ret = 'Email/Password'
          break
        }
        case 'Facebook': {
          ret = 'Facebook'
          break
        }
        case 'Yahoo': {
          ret = 'Yahoo'
          break
        }
        case 'Google': {
          ret = 'Google'
          break
        }
      }

      return ret
    }
  }
}
</script>
