<template>
  <div>
    <div class="d-flex justify-content-around">
      <iframe
        :src="'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FFreegle%2Fposts%2F' + postId + '&show_text=true'"
        width="552"
        height="576"
        style="border:none;overflow:hidden"
        scrolling="no"
        frameborder="0"
        allowfullscreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
    <div class="d-flex flex-wrap justify-content-around mt-3">
      <b-btn variant="secondary" size="lg" @click="skip">
        Skip this one
      </b-btn>
      <social-sharing
        :url="'https://www.facebook.com/Freegle/posts/' + postId"
        title="Sharing Freegle post'"
        hashtags="freegle,free,reuse"
        inline-template
        @open="open"
        @close="close"
      >
        <network network="facebook">
          <b-btn variant="secondary" size="lg" class="facebook">
            <v-icon name="brands/facebook" /> Share on Facebook
          </b-btn>
        </network>
      </social-sharing>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    postId() {
      return this.id.substring(this.id.indexOf('_') + 1)
    }
  },
  methods: {
    close() {
      this.$emit('done')
    },
    skip() {
      this.$emit('skipped')
    }
  }
}
</script>
