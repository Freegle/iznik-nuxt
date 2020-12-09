<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Running a Give and Take day
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <p>
            Several councils run Give and Take days in partnership with Freegle.  These are one-day community
            events that allow local residents to give items that they no longer need and take items that
            they want.  Think of it like a bring and buy stall, but everything is free!  Give and Take
            days are great for:
          </p>
          <ul>
            <li>Raising awareness of waste and reuse in your local area.</li>
            <li>Providing good PR for your council.</li>
            <li>Diverting items from HWRCs/residual waste/bulky waste collections.</li>
            <li>Building community!</li>
          </ul>
        </b-card-text>
      </b-card>
    </b-col>
    <b-col>
      <CouncilsContent />
    </b-col>
  </b-row>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'
import sectionScroll from '@/mixins/sectionScroll.js'
import CouncilsContent from '../../components/CouncilsContent'

export default {
  components: { CouncilsContent },
  mixins: [buildHead, sectionScroll],
  head() {
    return this.buildHead(
      'Councils - Running a Give and Take day',
      'Several councils run Give and Take days in partnership with Freegle.'
    )
  }
}
</script>
<style scoped>
.anchor {
  display: block;
  position: relative;
  top: -68px;
  visibility: hidden;
}
</style>
