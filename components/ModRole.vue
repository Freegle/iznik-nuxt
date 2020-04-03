<template>
  <b-select v-model="therole" @change="change">
    <option value="Member">
      Member
    </option>
    <option value="Moderator">
      Moderator
    </option>
    <option value="Owner">
      Owner
    </option>
  </b-select>
</template>
<script>
export default {
  props: {
    userid: {
      type: Number,
      required: true
    },
    groupid: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      therole: null
    }
  },
  mounted() {
    this.therole = this.role
  },
  methods: {
    async change(newval) {
      const params = {
        userid: this.userid,
        groupid: this.groupid,
        role: this.therole
      }

      await this.$store.dispatch('members/update', params)
    }
  }
}
</script>
<style scoped>
select {
  max-width: 150px;
}
</style>
