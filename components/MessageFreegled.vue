<template>
  <div>
    <b-img-lazy src="~/static/freegled.jpg" class="freegled__image" />
    <b-tooltip variant="success" :target="'msg-' + id">
      <p v-if="message.type === 'Offer'">
        Yay, someone took it!
      </p>
      <p v-else>
        Hurray, they got what they were looking for!
      </p>
      <p>
        Don't forget to Mark your posts as TAKEN/RECEIVED from <em>My Posts</em>.
      </p>
    </b-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  }
}
</script>
<style scoped lang="scss">
.freegled__image {
  position: absolute;
  width: 225px;
  z-index: 2;
  transform: rotate(15deg);
  top: 30%;

  // Centre the absolute positioned div in its container
  left: 50%;
  margin-left: -125px;
}
</style>
