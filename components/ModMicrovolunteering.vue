<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <div class="d-flex justify-content-between flex-wrap">
          <div>
            {{ item.timestamp | datetimeshort }}
          </div>
          <div>
            <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ item.user.id }} ({{ email }})
          </div>
          <div v-if="item.rotatedimage">
            <span v-if="item.result === 'Approve'">
              approved
            </span>
            <span v-if="item.result === 'Reject'" class="text-warning">
              rotated this photo
            </span>
          </div>
          <div v-else-if="item.message">
            <span v-if="item.result === 'Approve'">
              approved
            </span>
            <span v-if="item.result === 'Reject'" class="text-warning">
              <span v-if="item.msgcategory === 'CouldBeBetter'">
                thinks this message could be better
              </span>
              <span v-else-if="item.msgcategory === 'ShouldntBeHere'">
                thinks this message shouldn't be on Freegle
              </span>
            </span>
          </div>
          <div v-else-if="item.item1">
            matched
          </div>
          <div>
            <div v-if="item.rotatedimage">
              <b-img thumbnail :src="item.rotatedimage.thumb" class="thumb" />
            </div>
            <div v-else-if="item.message">
              <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ item.message.id }} {{ item.message.subject }}
            </div>
            <div v-else-if="item1">
              {{ item1.name }} and {{ item2.name }}
            </div>
            <div v-else>
              <!--              {{ item }}-->
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
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
    item() {
      return this.$store.getters['microvolunteering/get'](this.id)
    },
    email() {
      let ret = null

      this.item.user.emails.forEach(e => {
        if (!e.ourdomain && (!ret || e.preferred)) {
          ret = e.email
        }
      })

      return ret
    }
  }
}
</script>
<style scoped>
.thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
