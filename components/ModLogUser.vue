<template>
  <span v-if="user">
    <v-icon v-if="user.systemrole !== 'User'" name="crown" class="text-warning" title="Mod" />
    <v-icon v-else name="user" class="text-dark text-faded" title="User" />
    {{ user.displayname }}
    <span v-if="user.email" class="small">
      &lt;<ExternalLink :href="'mailto:' + user.email">{{ user.email }}</ExternalLink>&gt;
    </span>
    <span class="text-muted small">
      <v-icon name="hashtag" class="text-muted" scale="0.6" />{{ user.id }}
    </span>
  </span>
</template>
<script>
const ExternalLink = () => import('~/components/ExternalLink')
export default {
  components: { ExternalLink },
  props: {
    user: {
      type: Object,
      required: false,
      default: null
    }
  }
}
</script>
