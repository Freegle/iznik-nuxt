<template>
  <div class="container p-0">
    <span @click="rotateLeft">
      <v-icon label="Rotate left" class="topleft clickme" title="Rotate left">
        <v-icon name="circle" scale="2" />
        <v-icon
          name="reply"
          class="image__icon"
        />
      </v-icon>
    </span>
    <span @click="rotateRight">
      <v-icon label="Rotate right" class="topright clickme" title="Rotate right" flip="horizontal">
        <v-icon name="circle" scale="2" />
        <v-icon
          name="reply"
          class="image__icon"
        />
      </v-icon>
    </span>
    <span @click="remove">
      <v-icon label="Remove this photo" class="bottomright clickme" title="Remove this photo">
        <v-icon name="circle" scale="2" />
        <v-icon
          name="trash-alt"
          class="image__icon"
        />
      </v-icon>
    </span>
    <b-img
      v-if="thumbnail"
      :key="'img-' + cacheBust"
      lazy
      :src="ourPathThumb"
      rounded
      thumbnail
      class="square"
      @click="$emit('click') "
    />
    <b-img
      v-else
      :key="'img-' + cacheBust"
      lazy
      :src="path"
      rounded
      @click="$emit('click') "
    />
    <ConfirmModal v-if="confirm" ref="confirm" :title="'Delete this photo?'" @confirm="removeConfirmed" />
  </div>
</template>
<script>
const ConfirmModal = () => import('./ConfirmModal.vue')

export default {
  components: { ConfirmModal },
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
    },
    thumbnail: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: function() {
    return {
      cacheBust: Date.now(),
      confirm: false,
      deg: 0,
      ourPath: null,
      ourPathThumb: null
    }
  },
  mounted() {
    // Extract ro parameter from url of path
    if (this.path.indexOf('ro=') !== 1) {
      this.deg = parseInt(/ro=(\d+)/.exec(this.path)[1])
      this.ourPath = this.path
      this.ourPathThumb = this.paththumb
    } else {
      this.ourPath = this.path + '&ro=0'
      this.ourPathThumb = this.paththumb + '&ro=0'
    }
  },
  methods: {
    remove() {
      this.confirm = true
      this.waitForRef('confirm', () => {
        this.$refs.confirm.show()
      })
    },
    removeConfirmed() {
      this.$emit('remove', this.id)
    },
    rotate(deg) {
      this.deg += deg

      this.$axios
        .post(process.env.API + '/image', {
          id: this.id,
          rotate: this.deg,
          bust: Date.now()
        })
        .then(() => {
          // Add or replace ro parameter in ourPath and ourPathThumb to include this.deg
          this.ourPath = this.ourPath.replace(/ro=\d+/, `ro=${this.deg}`)
          this.ourPathThumb = this.ourPathThumb.replace(
            /ro=\d+/,
            `ro=${this.deg}`
          )
          this.cacheBust = Date.now()
        })
    },
    rotateLeft() {
      this.rotate(-90)
      this.cacheBust = Date.now()
    },
    rotateRight() {
      this.rotate(90)
      this.cacheBust = Date.now()
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

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

.image__icon {
  color: $color-white;
}

.square {
  object-fit: cover;
  width: 200px;
  height: 200px;
  max-width: 200px;
  min-width: 200px;
  min-height: 200px;
  max-height: 200px;
}
</style>
