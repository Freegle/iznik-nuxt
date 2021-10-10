<template>
  <b-card bg-variant="white" border-variant="grey" :class="'forcebreak clickme ' + (size === 'md' ? '' : 'p-1')" no-body @click="open">
    <b-card-body class="p-1">
      <div class="layout align-top">
        <div v-if="preview.image" class="image">
          <b-img-lazy v-if="size === 'md'" :src="preview.image" class="previewimage" @error.native="brokenImage" />
          <b-img-lazy v-if="size === 'sm'" :src="preview.image" class="previewimagesm" @error.native="brokenImage" />
        </div>
        <div class="title">
          <h3 v-if="preview.title && size === 'md'">
            {{ preview.title }}
          </h3>
          <h5 v-if="preview.title && size === 'sm'">
            {{ preview.title }}
          </h5>
        </div>
        <div class="description">
          <p v-if="preview.description && size === 'md'" class="preline forcebreak mb-0">
            <read-more :text="preview.description" :max-chars="200" class="nopara" />
          </p>
          <p v-if="preview.description && size === 'sm'" class="preline forcebreak mb-0 small">
            <read-more :text="preview.description" :max-chars="200" class="nopara" />
          </p>
        </div>
      </div>
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
    },
    brokenImage(event) {
      event.target.src = require('~/static/placeholder.jpg')
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';
@import 'color-vars';

.previewimage {
  margin-top: 1px;
  margin-left: 1px;
  width: 98px;
  height: 98px;
  border: 3px solid $color-white;

  @include media-breakpoint-up(md) {
    width: 198px;
    height: 198px;
  }
}

.previewimagesm {
  margin-top: 1px;
  margin-left: 1px;
  width: 72px;
  height: 72px;
  border: 3px solid $color-white;

  @include media-breakpoint-up(md) {
    width: 98px;
    height: 98px;
  }
}

.layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto auto auto;

  .image {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .title {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  .description {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }

  .footer {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
  }

  @include media-breakpoint-up(md) {
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto auto auto auto;

    .image {
      grid-column: 1 / 2;
      grid-row: 1 / 5;
    }

    .title {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }

    .description {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
    }

    .footer {
      grid-column: 2 / 3;
      grid-row: 3 / 4;
    }
  }
}
</style>
