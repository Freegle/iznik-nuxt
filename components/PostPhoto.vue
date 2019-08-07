<template>
  <div class="container p-0">
    <fa icon="reply" class="topleft clickme" title="Rotate left" @click="rotateLeft" />
    <fa icon="reply" class="topright fa-flip-horizontal clickme" title="Rotate right" @click="rotateRight" />
    <fa icon="trash-alt" class="bottomright clickme" title="Remove this photo" @click="remove" />
    <b-img lazy :src="paththumb + '?' + cacheBust" rounded thumbnail class="imagepreview" />
  </div>
</template>
<style scoped>
.imagepreview {
  width: 150px;
}

.bottomright {
  bottom: 12px;
  right: 10px;
  position: absolute;
  color: white;
}

.topleft {
  top: 12px;
  left: 10px;
  position: absolute;
  color: white;
}

.topright {
  top: 12px;
  right: 10px;
  position: absolute;
  color: white;
}

.container {
  position: relative;
}
</style>
<script>
// TODO Rotate and delete
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    paththumb: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      cacheBust: new Date().getTime()
    }
  },
  methods: {
    remove() {
      this.$emit('remove', this.id)
    },
    rotate(deg) {
      this.$axios
        .post(process.env.API + '/image', {
          id: this.id,
          rotate: deg,
          bust: new Date().getTime()
        })
        .then(() => {
          this.cacheBust = new Date().getTime()
        })
    },
    rotateLeft() {
      this.rotate(90)
    },
    rotateRight() {
      this.rotate(-90)
    }
  }
}
</script>
