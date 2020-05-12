<template>
  <b-img-lazy
    v-if="showImage"
    thumbnail
    class="sponsorClass m-0"
    :alt="altText"
    :src="image"
    @error.native="brokenSponsorImage"
  />
</template>

<script>
// This component should be imported, rather than using async require.  This is because async requires result in more
// Vue DOM patching overall, and this component is used in places like chat where it appears many times.  Testing shows
// this has a significant performance benefit.
export default {
  name: 'SponsorLogo',
  props: {
    image: {
      type: String,
      required: false,
      default: ''
    },
    altText: {
      type: String,
      required: false,
      default: 'Sponsor logo'
    }
  },
  data: function() {
    return {
      showImage: true
    }
  },
  methods: {
    brokenSponsorImage(event) {
      console.log('Broken', this.image)
      this.showImage = false
    }
  }
}
</script>

<style scoped lang="scss">
.sponsorClass {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
