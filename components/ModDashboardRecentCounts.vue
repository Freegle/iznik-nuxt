<template>
  <div v-if="RecentCounts">
    <p v-if="loading" class="text-faded pulsate">
      Loading...
    </p>
    <p v-else>
      During this time there have been
      <strong>{{ RecentCounts.newmessages | pluralize('new post', { includeNumber: true }) }}</strong> and
      <strong>{{ RecentCounts.newmembers | pluralize('new member', { includeNumber: true }) }}</strong>.
    </p>
  </div>
</template>
<script>
import ModDashboardBase from '~/components/ModDashboardBase'

export default {
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: ['RecentCounts'],
      RecentCounts: null
    }
  }
}
</script>
