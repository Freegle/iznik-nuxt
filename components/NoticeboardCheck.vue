<template>
  <div>
    <div v-if="check.inactive" class="d-flex justify-content-between">
      <div>
        {{ checkedat }}
      </div>
      <div>
        Marked as no longer active
        <span v-id="check.user">
          by {{ check.user.displayname }}
        </span>
      </div>
    </div>
    <div v-if="check.refreshed" class="d-flex justify-content-between">
      <div>
        {{ checkedat }}
      </div>
      <div>
        Poster put up
        <span v-id="check.user">
          by {{ check.user.displayname }}
        </span>
      </div>
    </div>
    <div v-if="check.comments" class="d-flex justify-content-between">
      <div>
        {{ checkedat }}
      </div>
      <div>
        <em>"{{ check.comments }}"</em> -
        <span v-id="check.user">
          by {{ check.user.displayname }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    noticeboard: {
      type: Object,
      required: true
    },
    check: {
      type: Object,
      required: true
    }
  },
  computed: {
    checkedat() {
      return this.$dayjs(this.check.checkedat).format('Do MMMM, YYYY')
    }
  }
}
</script>
