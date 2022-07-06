<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="bg-white">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>
            Freegle Focus: Social Housing
          </h1>
        </b-card-header>
        <b-card-text class="pl-2 pr-2">
          <h3>
            Freegle - making a house a home.
          </h3>
          <h3>
            Supporting stable & sustainable tenancies
          </h3>
          <h3>
            Reducing Furniture Poverty
          </h3>
          <p>This is a WIP - not uploaded yet</p>
          <p>
            <a href="/councils/SocialHousing.pdf">Download as a PDF</a>
          </p>
          <h2>
            Freegle can help.
          </h2>
          <p>
            Freegle works with local authorities, social housing providers and landlords
            to help create stable and sustainable social housing tenancies. When
            Freegle is visible to tenants at key points during their tenancy, councils and
            their tenants can be helped in a number of ways. Think FREEGLE!
          </p>
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
import CouncilsContent from '~/components/CouncilsContent'

export default {
  components: { CouncilsContent },
  mixins: [buildHead, sectionScroll],
  head() {
    return this.buildHead('Councils - Social Housing', 'Making a house a home')
  }
}
</script>
<style scoped lang="scss">
.anchor {
  display: block;
  position: relative;
  top: -68px;
  visibility: hidden;
}
.quote {
  font-size: 1.25rem;
  font-weight: bold;
  font-style: italic;

  &::before {
    content: open-quote;
  }

  &::after {
    content: close-quote;
  }
}
</style>
