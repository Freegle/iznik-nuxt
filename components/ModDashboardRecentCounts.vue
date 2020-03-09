<template>
  <div v-if="RecentCounts">
    <p v-if="loading" class="text-faded pulsate">
      Loading...
    </p>
    <p v-else>
      During this time there have been
      <b>{{ RecentCounts.newmessages | pluralize('new post', { includeNumber: true }) }}</b> and
      <b>{{ RecentCounts.newmembers | pluralize('new member', { includeNumber: true }) }}</b>.
    </p>
  </div>
</template>
<script>
import ModDashboardBase from '@/components/ModDashboardBase'

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
