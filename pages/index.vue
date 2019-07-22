<template>
  <section class="container">
    <p>
      Hello
      <span
        v-if="loggedInUser"
      >
        {{ loggedInUser.fullname }}
      </span>
    </p>
    <span v-for="group in groups" :key="id + '-' + group.id">
      <nuxt-link :to="'/explore/' + group.nameshort">
        {{ group.namedisplay }} {{ group.type }}<br>
      </nuxt-link>
    </span>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},

  computed: mapState({
    loggedInUser: state => state.auth.user,

    groups: state => {
      const groups = []
      // console.log('Grouplist', state.group.list)
      Object.keys(state.group.list).forEach(key => {
        const group = state.group.list[key]
        groups.push(group)
      })

      groups.sort(function(a, b) {
        const str1 = a.namedisplay
        const str2 = b.namedisplay
        return str1 < str2 ? -1 : str1 > str2 ? 1 : 0
      })

      return groups
    }
  })
}
</script>
