<template>
  <b-card border-variant="success" class="card" no-body>
    <b-card-header class="font-weight-bold bg-info">
      <div class="truncate" :title="book.title">
        {{ book.title }}
      </div>
      <div class="truncate small" :title="book.author">
        by {{ book.author }}
      </div>
    </b-card-header>
    <b-card-body class="p-0">
      <div class="p-1 d-flex flex-column text-center">
        <b-img-lazy
          v-if="book.isbndb && book.isbndb.image"
          :src="book.isbndb.image"
          fluid
          class="square"
          :class="imgerror ? 'faded' : ''"
          @error.native="brokenImage"
        />
        <b-img-lazy v-else :src="broke" fluid class="square faded" />
      </div>
    </b-card-body>
  </b-card>
</template>
<script>
export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      imgerror: false
    }
  },
  computed: {
    broke() {
      return require('~/static/bookplaceholder.svg')
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = this.broke
      this.imgerror = true
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.header {
  background-color: $colour-success-bg;
  color: $color-white;
}

.card {
  max-width: 360px;
  min-width: 360px;
}

.square {
  /*object-fit: cover;*/
  margin: auto;
  width: 100px;
  height: 100px;
}

.faded {
  opacity: 0.5;
}
</style>
