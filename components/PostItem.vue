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
          @change="change"
        />
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
.input-group,
.autocomplete-wrapper,
.input-group-append {
  display: inline-block;
}

.autocomplete-wrapper {
  width: 100%;
}

.input-group-append {
  /*TODO DESIGN This is a hacky way of positioning this button.*/
  top: -5px;
  left: -5px;
  position: relative;
}
</style>
<script>
import Autocomplete from '~/components/Autocomplete'
// TODO Make find location button work
// TODO It's quite easy to get the wrong postcode, or think it doesn't match, because of server lag.  Perhaps a busy
// indicator?

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

    // We need some fettling of the input keystrokes.
    const input = this.$refs.autocomplete.$refs.input
    input.addEventListener('keydown', this.keydown, false)
  },
  methods: {
    keydown(e) {
      if (e.which === 8) {
        // Backspace means we no longer have a full item.  Parent might want to know that we don't have a valid
        // item any more.
        this.$emit('cleared')
        this.results = null
      }

      const input = this.$refs.autocomplete.$refs.input
      this.$emit('typed', input.value)
    },
    process(results) {
      const items = results.items.slice(0, 5)
      const ret = []
      for (const item of items) {
        ret.push(item.item)
      }

      this.results = ret
      return ret
    },
    select(pc) {
      this.$emit('selected', pc)
    }
  }
}
</script>
