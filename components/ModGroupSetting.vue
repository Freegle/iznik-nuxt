<template>
  <b-form-group :label="label">
    <b-form-text class="mb-2">
      {{ description }}
    </b-form-text>
    <b-input-group v-if="type === 'input'">
      <b-input v-model="value" />
      <b-input-group-append>
        <SpinButton variant="white" name="save" label="Save" :handler="save" />
      </b-input-group-append>
    </b-input-group>
    <div v-else-if="type === 'textarea'">
      <b-row>
        <b-col>
          <b-textarea v-model="value" :rows="rows" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <SpinButton variant="white" name="save" label="Save" :handler="save" class="mt-2" />
        </b-col>
      </b-row>
    </div>
  </b-form-group>
</template>
<script>
import SpinButton from './SpinButton'
export default {
  components: { SpinButton },
  props: {
    name: {
      type: String,
      required: true
    },
    groupid: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'input'
    },
    rows: {
      type: Number,
      required: false,
      default: 3
    }
  },
  data: function() {
    return {
      value: null
    }
  },
  computed: {
    group() {
      return this.$store.getters['group/get'](this.groupid)
    }
  },
  watch: {
    groupid(newval) {
      console.log('Group changed', newval)
      this.getValueFromGroup()
    }
  },
  mounted() {
    this.getValueFromGroup()
  },
  methods: {
    async save() {
      const data = {
        id: this.groupid
      }

      data[this.name] = this.value

      await this.$store.dispatch('group/update', data)
    },
    getValueFromGroup() {
      const group = this.$store.getters['group/get'](this.groupid)
      this.value = group[this.name]
    }
  }
}
</script>
