<template>
  <b-modal
    :id="'newsPhotoModal-' + id"
    v-model="showModal"
    title="ChitChat Photo"
    size="lg"
    no-stacking
    ok-only
  >
    <template slot="default">
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
        <span v-if="mod" @click="remove">
          <v-icon label="Remove this photo" class="bottomright clickme" title="Remove this photo">
            <v-icon name="circle" scale="2" />
            <v-icon
              name="trash-alt"
              class="image__icon"
            />
          </v-icon>
        </span>
        <b-img
          lazy
          :src="src + '?' + cacheBust"
          rounded
          fluid
          alt="ChitChat Photo"
          @error.native="brokenImage"
        />
      </div>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    newsfeedid: {
      type: Number,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    imgflag: {
      type: String,
      required: true
    },
    imgtype: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      cacheBust: Date.now(),
      showModal: false
    }
  },
  computed: {
    mod() {
      const me = this.me
      return (
        me &&
        (me.systemrole === 'Moderator' ||
          me.systemrole === 'Admin' ||
          me.systemrole === 'Support')
      )
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    remove() {
      this.$emit('remove', this.id)
    },
    rotate(deg) {
      const data = {
        id: this.id,
        rotate: deg,
        bust: Date.now()
      }

      data[this.imgflag] = 1
      data.imgtype = this.imgtype

      this.$axios.post(process.env.API + '/image', data).then(() => {
        this.cacheBust = Date.now()
      })

      // Refetch the newsfeed entry to update any values in the parents, via the store.
      this.$store.dispatch('newsfeed/fetch', {
        id: this.newsfeedid
      })
    },
    rotateLeft() {
      this.rotate(90)
    },
    rotateRight() {
      this.rotate(-90)
    },
    brokenImage(event) {
      event.target.src = '/static/placeholder.jpg'
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
</style>
