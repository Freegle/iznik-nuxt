<template>
  <div class="container p-0">
    <fa-layers class="topleft clickme" title="Rotate left">
      <fa icon="circle" transform="grow-2" />
      <fa
        icon="reply"
        style="color: white;"
        transform="shrink-3"
        @click="rotateLeft"
      />
    </fa-layers>
    <fa-layers class="topright clickme" title="Rotate right">
      <fa icon="circle" transform="grow-2" />
      <fa
        icon="reply"
        class="fa-flip-horizontal"
        style="color: white;"
        transform="shrink-3"
        @click="rotateRight"
      />
    </fa-layers>
    <fa-layers class="bottomright clickme" title="Remove this photo">
      <fa icon="circle" transform="grow-2" />
      <fa
        icon="trash-alt"
        style="color: white;"
        transform="shrink-3"
        @click="remove"
      />
    </fa-layers>
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
}

.topleft {
  top: 12px;
  left: 10px;
  position: absolute;
}

.topright {
  top: 12px;
  right: 10px;
  position: absolute;
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
