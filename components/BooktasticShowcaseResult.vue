<template>
  <div>
    <client-only>
      <b-card no-body>
        <b-card-header>
          {{ result.books.length | pluralize('book', { includeNumber: true }) }}
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col cols="12" md="6">
              <div v-for="(book) in result.books" :key="book.author + book.title">
                {{ book.author }} - {{ book.title }}
              </div>
            </b-col>
            <b-col cols="12" md="6">
              <div @click="showModal = !showModal">
                <b-img-lazy fluid :src="result.img" class="book float-right clickme" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
      <b-modal v-model="showModal" ok-only size="lg">
        <b-img-lazy fluid :src="result.img" />
      </b-modal>
    </client-only>
  </div>
</template>
<script>
export default {
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {}
}
</script>
<style scoped>
.book {
  height: 200px;
}
</style>
