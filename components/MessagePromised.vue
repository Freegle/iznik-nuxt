<template>
  <div @click="$emit('click')">
    <div v-if="summary">
      <b-img-lazy src="~/static/promised.jpg" class="promised__image" />
      <b-tooltip variant="success" :target="'msg-' + id">
        <p v-if="!toMe">
          This item has already been promised to someone.  You can still reply, but you'll probably only get it if someone
          else drops out.
        </p>
        <p v-else>
          This has  been promised to you.
        </p>
      </b-tooltip>
    </div>
    <div v-else>
      <notice-message v-if="!toMe" variant="warning">
        This item has already been promised to someone.  You can still reply, but you'll probably only get it if someone
        else drops out.
      </notice-message>
      <notice-message v-else variant="primary">
        This has been promised to you.
      </notice-message>
    </div>
  </div>
</template>
<script>
import NoticeMessage from '@/components/NoticeMessage'

export default {
  components: { NoticeMessage },
  props: {
    id: {
      type: Number,
      required: true
    },
    toMe: {
      type: Boolean,
      required: false,
      default: false
    },
    summary: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
<style scoped lang="scss">
.promised__image {
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
