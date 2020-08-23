<template>
  <div>
    <!-- eslint-disable-next-line -->
    <a :href="'https://freegle.in/' + shortlink.name">freegle.in/{{ shortlink.name }}</a>
    <span class="text-muted small">
      created {{ shortlink.created | timeago }}
      {{ $pluralize('click', shortlink.clicks, true) }}
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
