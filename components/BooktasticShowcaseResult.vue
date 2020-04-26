<template>
  <div>
    <client-only>
      <b-card no-body>
        <b-card-header>
          <div class="d-flex justify-content-between">
            <div>
              {{ result.books.length | pluralize('book', { includeNumber: true }) }}
            </div>
            <div>
              <v-icon v-if="rating === 'Good'" name="smile" class="text-success" title="Probably a good effort" />
              <v-icon v-if="rating === 'OK'" name="meh" class="light text-faded" title="Probably did ok" />
              <v-icon v-if="rating === 'Bad'" name="frown" class="text-warning" title="Probably didn't do very well" />
            </div>
          </div>
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
  computed: {
    ratio() {
      return this.result.books.length / this.result.fragments.length
    },
    rating() {
      if (this.ratio > 0.25) {
        return 'Good'
      } else if (this.ratio < 0.15) {
        return 'Bad'
      } else {
        return 'OK'
      }
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
