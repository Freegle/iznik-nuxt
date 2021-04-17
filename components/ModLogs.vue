<template>
  <div>
    <b-row>
      <b-col cols="3" lg="2" class="font-weight-bold">
        Date / Time
      </b-col>
      <b-col cols="9" lg="4" class="forcebreak font-weight-bold">
        User
      </b-col>
      <b-col cols="12" lg="6" class="forcebreak font-weight-bold">
        Action
      </b-col>
    </b-row>

    <hr class="d-block d-md-none">

    <ModLog v-for="log in logs" :key="'log-' + log.id" :log="log" />

    <infinite-loading :distance="distance" @infinite="loadMore">
      <span slot="no-results" />
      <span slot="no-more" />
      <span slot="spinner">
        <b-img-lazy src="~/static/loader.gif" alt="Loading" />
      </span>
    </infinite-loading>
  </div>
</template>
<script>
import logsPage from '@/mixins/logsPage.js'
import ModLog from '~/components/ModLog'

export default {
  components: { ModLog },
  mixins: [logsPage]
}
</script>
