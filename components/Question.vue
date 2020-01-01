<template>
  <div>
    <b-btn v-b-toggle="'question-' + id" variant="link" class="m-1">
      <slot name="title" />
    </b-btn>
    <b-collapse :id="'question-' + id">
      <b-card border-variant="success" class="mt-1 shadow">
        <slot name="content" />
      </b-card>
    </b-collapse>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>
