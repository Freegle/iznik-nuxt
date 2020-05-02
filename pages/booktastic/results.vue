<template>
  <div>
    <h1>
      Booktastic Proof of Concept
    </h1>
    <b-card no-body>
      <b-card-header>
        Background
      </b-card-header>
      <b-card-body>
        <p>
          This is a proof of concept to see if we can recognise books from a photo of the spines on a shelf.
        </p>
        <p>
          If we can, we could build a Freegle-style lending community, where you can find books near you that
          you might want to borrow, and contact the owner to see if they would lend them to you.  You wouldn't
          lend books that it would break your heart not to get back.
        </p>
        <p>
          There are other similar communities - but they're not really local, and they rely on scanning barcodes to
          enter, which is very tedious indeed because you have to take them off the shelf.
        </p>
        <p>
          The idea is that we don't need to be able to identify 100% of books - if we can very easily identify 75%,
          then that's enough.  If we miss a book in one place we'll probably have a copy somewhere else.  If we
          get the occasional book wrong then people can correct it.
        </p>
        <p>
          So the key thing is whether we can identify enough books.  Here are some sample results:
        </p>
      </b-card-body>
    </b-card>
    <div v-if="results">
      <BooktasticShowcaseResult v-for="(result, i) in results" :key="i + '-' + result.img" :result="result" />
    </div>
  </div>
</template>

<script>
import BooktasticShowcaseResult from '../../components/BooktasticShowcaseResult'
const a = require('axios')
const axios = a.create({
  timeout: 300000
})

export default {
  components: { BooktasticShowcaseResult },
  head: {
    title: 'Booktastic Results',
    script: [{}],
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Capture books from camera'
      }
    ]
  },
  data() {
    return {
      results: null
    }
  },
  async mounted() {
    const response = await axios.get(
      'https://iznik.ilovefreegle.org/api/catalogue'
    )

    const rsp = response.data

    if (rsp.ret === 0 && rsp.results) {
      this.results = rsp.results
    }
  }
}
</script>
<style>
body {
  background-color: #f0f0f0;
}

.smallimg {
  max-width: 200px;
}
</style>
