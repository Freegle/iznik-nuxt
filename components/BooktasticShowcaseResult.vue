<template>
  <div>
    <client-only>
      <b-card v-if="result.books" no-body>
        <b-card-header>
          <div class="d-flex justify-content-between">
            <div>
              {{ $pluralize('book', result.books.length, true) }}
            </div>
            <div>
              <v-icon v-if="rating === 'Good'" name="smile" class="text-success" title="Probably a good effort" scale="2" />
              <v-icon v-if="rating === 'OK'" name="meh" class="light text-faded" title="Probably did ok" scale="2" />
              <v-icon v-if="rating === 'Bad'" name="frown" class="text-warning" title="Probably didn't do very well" scale="2" />
            </div>
          </div>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col cols="12" md="6">
              <!--              Bit of nonsense to handle an old result format-->
              <div v-for="(book) in result.books" :key="book.author + book.title + book.Author + book.Title">
                {{ book.author }}{{ book.Author }} - {{ book.title }}{{ book.Title }}
              </div>
            </b-col>
            <b-col cols="12" md="6">
              <div @click="showModal = !showModal">
                <div class="float-right text-center">
                  <b-img-lazy fluid :src="result.timg" class="book float-right clickme" thumbnail />
                  <p class="text-muted small">
                    Click to view
                  </p>
                </div>
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
      if (this.result.books.length > 7) {
        return 'Good'
      } else if (this.result.books.length < 4) {
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
  height: 100px;
}
</style>
