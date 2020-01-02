<template>
  <div>
    <b-row>
      <b-col>
        <autocomplete
          ref="autocomplete"
          :url="source"
          param="typeahead"
          anchor="name"
          label=""
          :classes="{ input: 'form-control', list: 'iteminp' }"
          :min="3"
          :debounce="100"
          :process="process"
          :on-select="select"
          size="60"
          maxlength="60"
          spellcheck="true"
          placeholder="In a single word or phrase, what is it?"
          @input="input"
        />
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
.autocomplete-wrapper {
  display: inline-block;
  width: 100%;
}
</style>

<script>
import Autocomplete from '~/components/Autocomplete'

export default {
  components: {
    Autocomplete
  },
  props: {
    item: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      source: process.env.API + '/item',
      results: [],
      mylocation: null
    }
  },
  mounted() {
    // Focus on field to grab their attention.
    this.$refs.autocomplete.$refs.input.focus()

    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this on the server.
    this.$refs.autocomplete.setValue(this.item)
  },
  methods: {
    input(newValue) {
      if (!newValue.length) {
        this.$emit('cleared')
      } else {
        this.$emit('typed', newValue)
      }
    },
    process(results) {
      const items =
        results.items.length > 5 ? results.items.slice(0, 5) : results.items
      const ret = []
      for (const item of items) {
        if (item && item.item) {
          ret.push(item.item)
        }
      }

      this.results = ret
      return ret
    },
    select(pc) {
      this.$emit('selected', pc)
    },
    set(value) {
      this.$refs.autocomplete.setValue(value)
    }
  }
}
</script>
