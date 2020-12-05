<template>
  <div>
    <h2 class="text-center header--size4">
      Click any photos that need rotating
    </h2>
    <div class="d-flex justify-content-around">
      <div class="layout">
        <MicroVolunteeringPhotoRotate v-for="photo in currentPhotos" :key="'photo-' + photo.id" :photo="photo" class="m-1" @rotate="rotate(photo, $event)" />
      </div>
    </div>
    <div class="d-flex justify-content-around mt-2">
      <SpinButton
        name="save"
        variant="primary"
        size="lg"
        :handler="done"
        label="All photos look good"
        spinclass="text-white"
      />
    </div>
  </div>
</template>
<script>
import MicroVolunteeringPhotoRotate from './MicroVolunteeringPhotoRotate'
import SpinButton from './SpinButton'

export default {
  components: { SpinButton, MicroVolunteeringPhotoRotate },
  props: {
    photos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentPhotos: [],
      bump: 1
    }
  },
  created() {
    this.currentPhotos = this.photos

    this.currentPhotos.forEach(p => {
      p.rotate = 0
    })
  },
  methods: {
    rotate(photo, rotate) {
      this.currentPhotos.forEach((p, i) => {
        if (p.id === photo.id) {
          this.currentPhotos[i].rotate = rotate
        }
      })

      this.bump++
    },
    async done() {
      const promises = []
      for (const p of this.currentPhotos) {
        promises.push(
          this.$api.microvolunteering.response({
            photoid: p.id,
            response: p.rotate === 0 ? 'Accept' : 'Recept',
            deg: p.rotate
          })
        )
      }

      await Promise.all(promises)

      this.$emit('done')
    }
  }
}
</script>
<style scoped lang="scss">
.layout {
  display: grid;
  grid-template-columns: repeat(3, 170px);
  grid-template-rows: repeat(3, 170px);
}
</style>
