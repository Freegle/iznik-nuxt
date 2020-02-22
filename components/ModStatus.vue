<template>
  <span title="Platform Status - click for more info" @click="clicked">
    <span v-if="fine" class="fine" />
    <span v-if="warning" class="warning" />
    <span v-if="error" class="error" />
    <b-modal
      id="statusmmodal"
      v-model="show"
      no-stacking
      :title="'Platform Status: ' + headline"
    >
      <template slot="default">
        <NoticeMessage v-if="warning || error" variant="warning" class="mb-2">
          There is a problem. Please alert geeks@ilovefreegle.org if this persists for more than an hour.
        </NoticeMessage>
        <NoticeMessage v-else variant="success">
          Everything seems fine.
        </NoticeMessage>
        <div v-if="status && status.info">
          <div v-for="(stat, server) in status.info" :key="server">
            <div v-if="stat.warning" class="d-flex justify-content-between">
              <b>{{ server }}</b>
              <em>{{ stat.warningtext }}</em>
            </div>
            <div v-if="stat.error" class="d-flex justify-content-between">
              <b>{{ server }}</b>
              <em>{{ stat.errortext }}</em>
            </div>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>

    </b-modal>
  </span>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  data: function() {
    return {
      overall: 'green',
      status: null,
      updated: null,
      show: false
    }
  },
  computed: {
    outOfDate() {
      // Check if we've managed to get it recently.
      return !this.updated || Date.now() - this.updated >= 1000 * 600
    },
    error() {
      return this.status ? this.status.error : false
    },
    warning() {
      return this.outOfDate || (this.status && this.status.warning)
    },
    fine() {
      return this.status ? this.status.fine : false
    },
    headline() {
      if (this.outOfDate) {
        return 'Not sure'
      } else if (this.warning) {
        return 'Warning'
      } else if (this.error) {
        return 'Error'
      } else {
        return 'Fine'
      }
    }
  },
  mounted() {
    this.checkStatus()
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  methods: {
    async checkStatus() {
      this.status = await this.$api.status.fetch()
      if (this.status.ret === 0) {
        this.updated = Date.now()
      }

      this.timer = setTimeout(this.checkStatus, 30000)
    },
    clicked() {
      this.show = true
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.error {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: $color-red;
  display: block;
}

.warning {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: $color-orange--dark;
  display: block;
}

.fine {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: $color-green--medium;
  display: block;
}
</style>
