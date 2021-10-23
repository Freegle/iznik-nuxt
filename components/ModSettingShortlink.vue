<template>
  <div>
    <!-- eslint-disable-next-line -->
    <a :href="'https://freegle.in/' + shortlink.name" rel="noopener noreferrer">freegle.in/{{ shortlink.name }}</a>
    <span class="text-muted small">
      created {{ timeago(shortlink.created) }}
      {{ shortlink.clicks | pluralize('click', { includeNumber: true }) }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    shortlink: {
      type: Object,
      required: true
    }
  }
}
</script>
