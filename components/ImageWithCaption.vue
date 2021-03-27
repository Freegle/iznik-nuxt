<template>
  <div class="d-flex justify-content-around mt-2 mb-2">
    <div class="border border-info m-2 p-2">
      <div>
        <b-img fluid :src="src" :alt="text" />
      </div>
      <div class="text-center small">
        {{ text }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
