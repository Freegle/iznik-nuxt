<template>
  <div class="container p-0">
    <v-icon label="Rotate left" class="topleft clickme" title="Rotate left">
      <v-icon name="circle" transform="grow-2" />
      <v-icon
        name="reply"
        style="color: white;"
        transform="shrink-3"
        @click="rotateLeft"
      />
    </v-icon>
    <v-icon label="Rotate left" class="topright clickme" title="Rotate right" flip="horizontal">
      <v-icon name="circle" transform="grow-2" />
      <v-icon
        name="reply"
        style="color: white;"
        transform="shrink-3"
        @click="rotateRight"
      />
    </v-icon>
    <v-icon label="Rotate left" class="bottomright clickme" title="Remove this photo">
      <v-icon name="circle" transform="grow-2" />
      <v-icon
        name="trash-alt"
        style="color: white;"
        transform="shrink-3"
        @click="remove"
      />
    </v-icon>
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
