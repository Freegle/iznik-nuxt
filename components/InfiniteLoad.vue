<template>
  <div>
    <ul>
      <li v-for="item in list" :key="item.id" class="list-item">
        {{ item.title }}
      </li>
    </ul>
    <Observer @intersect="intersected" />
  </div>
</template>

<script>
import Observer from './Observer'
const a = require('axios')
const axios = a.create({
  timeout: 300000
})

export default {
  components: {
    Observer
  },
  data() {
    return {
      page: 1,
      list: []
    }
  },
  methods: {
    async intersected() {
      console.log('Getting more data...')

      const ret = await axios.get(
        '//hn.algolia.com/api/v1/search_by_date?tags=story',
        {
          params: {
            page: this.page
          }
        }
      )

      console.log(this.list)

      this.list = [...this.list, ...ret.data.hits]
      this.page++
    }
  }
}
</script>
