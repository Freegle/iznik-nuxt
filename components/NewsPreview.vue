<template>
  <b-card bg-variant="white" border-variant="grey" :class="'forcebreak clickme ' + (size === 'md' ? '' : 'p-1')" no-body @click="open">
    <b-card-body class="p-1">
      <b-media>
        <template v-if="preview.image" slot="aside">
          <b-img v-if="size === 'md'" lazy :src="preview.image" class="previewimage" />
          <b-img v-if="size === 'sm'" lazy :src="preview.image" class="previewimagesm" />
        </template>
        <b-media-body class="align-top">
          <h3 v-if="preview.title && size === 'md'">
            {{ preview.title }}
          </h3>
          <h5 v-if="preview.title && size === 'sm'">
            {{ preview.title }}
          </h5>
          <p v-if="preview.description && size === 'md'" class="prewrap forcebreak mb-0">
            <read-more :text="preview.description" :max-chars="200" class="nopara" />
          </p>
          <p v-if="preview.description && size === 'sm'" class="prewrap forcebreak mb-0 small">
            <read-more :text="preview.description" :max-chars="200" class="nopara" />
          </p>
          <span class="small text-muted">
            This is an automatic preview of {{ preview.url }}.  Click at your own risk.
          </span>
        </b-media-body>
      </b-media>
    </b-card-body>
  </b-card>
</template>
<script>
export default {
  props: {
    preview: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    }
  },
  methods: {
    open() {
      window.open(this.preview.url)
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.previewimage {
  margin-top: 1px;
  margin-left: 1px;
  width: 98px;
  height: 98px;
  border: 3px solid $color-white;
}

.previewimagesm {
  margin-top: 1px;
  margin-left: 1px;
  width: 72px;
  height: 72px;
  border: 3px solid $color-white;
}
</style>
