<template>
  <div :class="`${getClassName('wrapper')} autocomplete-wrapper`">
    <b-input-group>
      <input
        :id="id"
        ref="input"
        v-model="type"
        type="text"
        :class="`${getClassName('input')} autocomplete-input`"
        :placeholder="placeholder"
        :name="name"
        autocomplete="off"
        @input="handleInput"
        @dblclick="handleDoubleClick"
        @blur="handleBlur"
        @keydown="handleKeyDown"
        @focus="handleFocus"
      >

      <b-input-group-append v-if="searchbutton">
        <b-button variant="success" size="lg" @click="search">
          <v-icon name="search" />&nbsp;Search
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <div
      v-show="showList && json.length"
      :class="`${getClassName('list')} autocomplete autocomplete-list`"
    >
      <ul>
        <li
          v-for="(data, i) in json"
          :key="'autocomplete' + data.id"
          :class="activeClass(i)"
        >
          <a
            href="#"
            @click.prevent="selectList(data)"
            @mousemove="mousemove(i)"
          >
            <!-- eslint-disable-next-line -->
            <div v-if="onShouldRenderChild" v-html="onShouldRenderChild(data)" />
            <div v-if="!onShouldRenderChild">
              <b class="autocomplete-anchor-text">{{ deepValue(data, anchor) }}</b>
              <span class="autocomplete-anchor-label">{{ deepValue(data, label) }}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
/*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
* Licensed Under MIT (http://opensource.org/licenses/MIT)
*
* Modified by EH.
*
* Vue 2 Autocomplete @ Version 0.0.1
*
*/

/* eslint-disable */

export default {
  props: {
    id: String,
    name: String,
    className: String,
    classes: {
      type: Object,
      default: () => ({
        wrapper: false,
        input: false,
        list: false,
        item: false
      })
    },
    placeholder: String,
    required: Boolean,

    // Intial Value
    initValue: {
      type: String,
      default: ''
    },

    // Manual List
    options: Array,

    // Filter After Get the data
    filterByAnchor: {
      type: Boolean,
      default: true
    },

    // Anchor of list
    anchor: {
      type: String,
      required: true
    },

    // Label of list
    label: String,

    // Debounce time
    debounce: Number,

    // ajax URL will be fetched
    url: {
      type: String,
      required: true
    },

    // query param
    param: {
      type: String,
      default: 'q'
    },

    encodeParams: {
      type: Boolean,
      default: true
    },

    // Custom Params
    customParams: Object,

    // Custom Headers
    customHeaders: Object,

    // minimum length
    min: {
      type: Number,
      default: 0
    },

    // Create a custom template from data.
    onShouldRenderChild: Function,

    // Process the result before retrieveng the result array.
    process: Function,

    // Callback
    onInput: Function,
    onShow: Function,
    onBlur: Function,
    onHide: Function,
    onFocus: Function,
    onSelect: Function,
    onBeforeAjax: Function,
    onAjaxProgress: Function,
    onAjaxLoaded: Function,
    onShouldGetData: Function,

    searchbutton: {
      type: String,
      required: false,
      default: ""
    }
  },

  data() {
    return {
      showList: false,
      type: '',
      json: [],
      focusList: '',
      debounceTask: undefined
    }
  },

  computed: {
    faSearch() {
      return faSearch
    },
  },

  watch: {
    options(newVal, oldVal) {
      if (this.filterByAnchor) {
        const { type, anchor } = this
        const regex = new RegExp(`${type}`, 'i')
        const filtered = newVal.filter(item => {
          const found = item[anchor].search(regex) !== -1
          return found
        })
        this.json = filtered
      } else {
        this.json = newVal
      }
    }
  },

  created() {
    // Sync parent model with initValue Props
    this.type = this.initValue ? this.initValue : null
  },

  mounted() {
    if (this.required) this.$refs.input.setAttribute('required', this.required)
  },

  methods: {
    getClassName(part) {
      const { classes, className } = this
      if (classes[part]) return `${classes[part]}`
      return className ? `${className}-${part}` : ''
    },

    // Netralize Autocomplete
    clearInput() {
      this.showList = false
      this.type = ''
      this.json = []
      this.focusList = ''
    },

    // Get the original data
    cleanUp(data) {
      return data ? JSON.parse(JSON.stringify(data)) : null
    },

    /* ==============================
      INPUT EVENTS
    ============================= */
    handleInput(e) {
      const { value } = e.target
      this.showList = true
      // Callback Event
      if (this.onInput) this.onInput(value)
      // If Debounce
      if (this.debounce) {
        if (this.debounceTask !== undefined) clearTimeout(this.debounceTask)
        this.debounceTask = setTimeout(() => {
          return this.getData(value)
        }, this.debounce)
      } else {
        return this.getData(value)
      }
    },

    handleKeyDown(e) {
      const key = e.keyCode

      // Disable when list isn't showing up
      if (!this.showList) return

      // Key List
      const DOWN = 40
      const UP = 38
      const ENTER = 13
      const ESC = 27

      // Prevent Default for Prevent Cursor Move & Form Submit
      switch (key) {
        case DOWN:
          e.preventDefault()
          this.focusList++
          break
        case UP:
          e.preventDefault()
          this.focusList--
          break
        case ENTER:
          e.preventDefault()
          this.selectList(this.json[this.focusList])
          this.showList = false
          break
        case ESC:
          this.showList = false
          break
      }

      const listLength = this.json.length - 1
      const outOfRangeBottom = this.focusList > listLength
      const outOfRangeTop = this.focusList < 0
      const topItemIndex = 0
      const bottomItemIndex = listLength

      let nextFocusList = this.focusList
      if (outOfRangeBottom) nextFocusList = topItemIndex
      if (outOfRangeTop) nextFocusList = bottomItemIndex
      this.focusList = nextFocusList
    },

    setValue(val) {
      this.type = val
    },

    /* ==============================
      LIST EVENTS
    ============================= */

    handleDoubleClick() {
      this.json = []
      this.getData('')
      // Callback Event
      this.onShow ? this.onShow() : null
      this.showList = true
    },

    handleBlur(e) {
      // Callback Event
      this.onBlur ? this.onBlur(e) : null
      setTimeout(() => {
        // Callback Event
        this.onHide ? this.onHide() : null
        this.showList = false
      }, 250)
    },

    handleFocus(e) {
      this.focusList = 0

      // Force the list to show.
      this.showList = true
      let value = this.$refs.input.value
      if (value) {
        this.getData(value)
      }

      // Callback Event
      this.onFocus ? this.onFocus(e) : null
    },

    mousemove(i) {
      this.focusList = i
    },

    activeClass(i) {
      const focusClass = i === this.focusList ? 'focus-list' : ''
      return `${focusClass}`
    },

    selectList(data) {
      // Deep clone of the original object
      let clean = null
      if (!data) {
        // No data - revert
        this.type = this.initValue ? this.initValue : null
      } else {
        clean = this.cleanUp(data)
        // Put the selected data to type (model)
        this.type = clean[this.anchor]
      }
      // Hide List
      this.showList = false
      // Callback Event
      this.onSelect ? this.onSelect(clean) : null
    },

    deepValue(obj, path) {
      const arrayPath = path.split('.')
      for (let i = 0; i < arrayPath.length; i++) {
        obj = obj[arrayPath[i]]
      }
      return obj
    },

    /* ==============================
      AJAX EVENTS
    ============================= */

    composeParams(val) {
      const encode = val => (this.encodeParams ? encodeURIComponent(val) : val)
      let params = `${this.param}=${encode(val)}`
      if (this.customParams) {
        Object.keys(this.customParams).forEach(key => {
          params += `&${key}=${encode(this.customParams[key])}`
        })
      }
      return params
    },

    composeHeader(ajax) {
      if (this.customHeaders) {
        Object.keys(this.customHeaders).forEach(key => {
          ajax.setRequestHeader(key, this.customHeaders[key])
        })
      }
    },

    doAjax(val) {
      // Callback Event
      this.onBeforeAjax ? this.onBeforeAjax(val) : null
      // Compose Params
      const params = this.composeParams(val)
      // Init Ajax
      const ajax = new XMLHttpRequest()
      ajax.open('GET', `${this.url}?${params}`, true)
      this.composeHeader(ajax)
      // Callback Event
      ajax.addEventListener('progress', data => {
        if (data.lengthComputable && this.onAjaxProgress)
          this.onAjaxProgress(data)
      })
      // On Done
      ajax.addEventListener('loadend', e => {
        const { responseText } = e.target
        const json = JSON.parse(responseText)
        // Callback Event
        this.onAjaxLoaded ? this.onAjaxLoaded(json) : null
        this.json = this.process ? this.process(json) : json
      })
      // Send Ajax
      ajax.send()
    },

    getData(value) {
      if (value.length < this.min || !this.url) return
      if (this.onShouldGetData) this.manualGetData(value)
      else this.doAjax(value)
    },

    // Do Ajax Manually, so user can do whatever he want
    manualGetData(val) {
      const task = this.onShouldGetData(val)
      if (task && task.then) {
        return task.then(options => {
          this.json = options
        })
      }
    },

    search() {
      this.$emit('search')
    }
  }
}

/* eslint-enable */
</script>
