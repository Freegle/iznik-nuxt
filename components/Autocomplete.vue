<template>
  <div :class="`${getClassName('wrapper')} autocomplete-wrapper`">
    <div :class="parentClass">
      <b-input-group :class="wrapClass">
        <input
          :id="id"
          ref="input"
          v-model="type"
          type="text"
          :class="`${getClassName('input')} autocomplete-input`"
          :placeholder="placeholder"
          :name="name"
          autocomplete="off"
          :invalid="invalid"
          :size="size"
          @input="handleInput"
          @dblclick="handleDoubleClick"
          @blur="handleBlur"
          @keydown="handleKeyDown"
          @focus="handleFocus"
        >
        <b-input-group-append>
          <b-button variant="white" class="transbord p-0 pr-2" tabindex="-1">
            <v-icon name="sync" :class="'text-success fa-spin ' + (ajaxInProgress ? 'visible': 'invisible')" />
          </b-button>
        </b-input-group-append>
      </b-input-group>
      <b-button v-if="searchbutton" variant="primary" size="lg" class="searchbutton" @click="search">
        <v-icon name="search" />&nbsp;Search
      </b-button>
    </div>
    <div
      v-show="showList && json.length"
      :class="`${getClassName('list')} autocomplete autocomplete-list position-relative`"
    >
      <v-icon v-if="closeButton" name="times-circle" class="close mt-1 clickme" scale="2" @click="close" />
      <ul :class="`${getClassName('listentrylist')}`">
        <li
          v-for="(data, i) in json"
          :key="'autocomplete' + data.id"
          :class="activeClass(i) + ' ' + `${getClassName('listentry')}`"
        >
          <a
            href="#"
            @click.prevent="selectList(data)"
            @mousemove="mousemove(i)"
          >
            <!-- eslint-disable-next-line -->
            <div v-if="onShouldRenderChild" v-html="onShouldRenderChild(data)" />
            <div v-if="!onShouldRenderChild">
              <Highlighter
                :text-to-highlight="deepValue(data, anchor)"
                :search-words="[type]"
                highlight-class-name="highlight"
                auto-escape
                class="autocomplete-anchor-text"
              />
              <span class="autocomplete-anchor-label">{{ deepValue(data, label) }}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/*
* Originally based on:
*
*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
* Licensed Under MIT (http://opensource.org/licenses/MIT)
*
* Vue 2 Autocomplete @ Version 0.0.1
*
* Modified by EH as that repository is no longer maintained.
*
*/

/* eslint-disable */

import cloneDeep from 'lodash.clonedeep'
const Highlighter = () => import('vue-highlight-words')

export default {
  components: {
    Highlighter
  },
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
        item: false,
        listentry: false,
        listentrylist: false
      })
    },
    placeholder: String,
    required: Boolean,

    // Initial Value
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

    restrict: {
      type: Boolean,
      default: false
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
    },

    timeout: {
      type: Number,
      required: false,
      default: null
    },

    closeButton: {
      type: Boolean,
      required: false,
      default: false
    },

    size: {
      type: Number,
      required: false,
      default: null
    },

    variant: {
      type: String,
      required: false,
      default: null
    }
  },

  data() {
    return {
      showList: false,
      showTimer: null,
      type: '',
      json: [],
      focusList: '',
      debounceTask: undefined,
      ajaxInProgress: null,
      ajaxDeferred: null,
      invalid: false,
      focused: false
    }
  },

  computed: {
    faSearch() {
      return faSearch
    },
    wrapClass() {
      let border

      switch (this.variant) {
        case 'primary': {
          border = ' border border-primary'
          break;
        }
        case 'success': {
          border = ' border border-success'
          break;
        }
        default: {
          border = ''
          break;
        }
      }

      return 'autocomplete-wrap ' + (this.focused ? ' autocomplete-wrap-focus' : '') + ' ' + border
    },
    parentClass() {
      return 'd-flex ' + (this.searchbutton ? 'autocomplete-parent-focus' : '') + (this.invalid ? ' invalid' : '')
    }
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
    },
    type(newVal) {
      // We want to alert users of this component to changed data.
      this.$emit('input', newVal)
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

    clearTimer() {
      if (this.showTimer) {
        clearTimeout(this.showTimer)
      }
    },

    startTimer() {
      this.clearTimer()
      this.showTimer = setTimeout(() => {
        this.showList = false
        this.showTimer = null
      }, 30000)
    },

    // Netralize Autocomplete
    clearInput() {
      this.showList = false
      this.clearTimer()
      this.type = ''
      this.json = []
      this.focusList = ''
    },

    // Get the original data
    cleanUp(data) {
      return data ? cloneDeep(data) : null
    },

    /* ==============================
      INPUT EVENTS
    ============================= */
    handleInput(e) {
      const { value } = e.target
      this.showList = true
      this.startTimer()
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

          if (this.ajaxInProgress) {
            // Wait until the ajax call has completed. Not in the most elegant way.
            let self = this
            setTimeout(() => {
              self.handleKeyDown.apply(self, [e])
            }, 100)
          } else {
            this.selectList(this.json[this.focusList])
            this.showList = false
            this.clearTimer()
          }
          break
        case ESC:
          this.showList = false
          this.clearTimer()
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
      this.startTimer()
    },

    handleBlur(e) {
      this.focused = false

      // Callback Event
      this.onBlur ? this.onBlur(e) : null
      setTimeout(() => {
        // Callback Event
        this.onHide ? this.onHide() : null
        this.showList = false
        this.clearTimer()
      }, 250)
    },

    handleFocus(e) {
      this.focused = true
      this.focusList = 0

      // Force the list to show.
      this.showList = true
      this.startTimer()
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
      this.clearTimer()
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
      this.invalid = false

      if (this.ajaxInProgress) {
        // We're already doing a request.  Don't send another one, partly out of politeness to the server, and
        // partly because if they complete out of sequence then we will end up with the wrong values.
        if (this.ajaxDeferred) {
          clearTimeout(this.ajaxDeferred)
        }

        this.ajaxDeferred = setTimeout(() => {
          this.doAjax(val)
        }, 100)
      } else {
        // Callback Event
        this.onBeforeAjax ? this.onBeforeAjax(val) : null
        // Compose Params
        const params = this.composeParams(val.trim())
        // Init Ajax
        const ajax = new XMLHttpRequest()

        // Save this request so that we know it's happening.
        this.ajaxInProgress = ajax

        ajax.open('GET', `${this.url}?${params}`, true)
        this.composeHeader(ajax)
        // Callback Event
        ajax.addEventListener('progress', data => {
          if (data.lengthComputable && this.onAjaxProgress)
            this.onAjaxProgress(data)
        })
        // On Done
        ajax.addEventListener('loadend', e => {
          const { status, responseText } = e.target

          if (status === 200) {
            const json = JSON.parse(responseText)
            // Callback Event
            this.onAjaxLoaded ? this.onAjaxLoaded(json) : null
            this.json = this.process ? this.process(json) : json

            if (this.restrict && (!this.json || this.json.length === 0)) {
              // What we have doesn't match.  Indicate that we have selected an invalid value.
              if (this.onSelect) {
                this.$emit('invalid')
                this.invalid = true
              }
            }
            else if (this.json && this.json.length === 1 && this.json[0].name.toLowerCase().replace(' ', '').trim() === val.toLowerCase().replace(' ', '').trim()) {
              // There is only one value, and it matches the value we were searching for.  Autoselect it.
              this.selectList(this.json[0])
            }
          } else {
            console.log("Autocomplete failed with", status)
          }

          // We no longer have a request in progress.
          this.ajaxInProgress = null
        })
        // Send Ajax
        ajax.send()
      }
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
    },

    close() {
      this.showList = false
      this.clearTimer()
    }
  }
}

/* eslint-enable */
</script>

<style scoped lang="scss">
@import 'color-vars';

.transbord {
  border-color: $color-gray-4;
  border-left: none;
}

/* iteminp class is passed into this component in a prop */
.iteminp ul {
  width: 100% !important;
  right: 0px !important;
  padding-right: 15px !important;
  padding-left: 15px !important;
}

/* autocompletelist class is passed into this component in a prop */
.autocompletelist {
  z-index: 900;
}

.autocompletelist li {
  box-shadow: 1px 3px 5px 3px $color-black-opacity-60;
  width: 238px;
}

/* Deep selector for scoped CSS */
::v-deep .pcinp {
  min-width: 100px;
  max-width: 238px;
  margin: 0 auto;
}

.transition,
.autocomplete,
.showAll-transition,
.autocomplete ul,
.autocomplete ul li a {
  transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -o-transition: all 0.3s ease-out;
}

.autocomplete ul {
  font-family: sans-serif;
  position: absolute;
  list-style: none;
  background: $color-white;
  padding: 0;
  margin: 0;
  display: inline-block;
  min-width: 15%;
  margin-top: 0px;
  z-index: 1000;
  right: 48%;
  border: 1px solid $color-gray--light;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}

::v-deep .postcodelist.autocomplete ul {
  position: initial;
}

/*.autocomplete ul:before{*/
/*content: "";*/
/*display: block;*/
/*position: absolute;*/
/*height: 0;*/
/*width: 0;*/
/*border: 10px solid transparent;*/
/*border-bottom: 10px solid $color-gray--lighter;*/
/*left: 46%;*/
/*top: -20px*/
/*}*/

.autocomplete-anchor-text {
  color: $color-gray--dark !important;
}

.autocomplete-anchor-text span {
  color: $color-gray--dark !important;
}

.autocomplete-anchor-text:hover {
  color: $color-gray--dark;
  background: $color-gray--lighter;
}

.autocomplete ul li a {
  text-decoration: none;
  display: block;
  padding: 5px;
  padding-left: 10px;
  color: $color-gray--dark;
  font-size: 13px;
}

.autocomplete ul li a:hover,
.autocomplete ul li.focus-list a {
  color: $color-gray--dark;
  background: $color-gray--lighter;
}

.autocomplete ul li a .autocomplete-anchor-label {
  display: block;
  margin-top: 3px;
  color: $color-gray--dark;
  font-size: 13px;
}

.autocomplete ul li a:hover .autocomplete-anchor-label,
.autocomplete ul li.focus-list a span, /*backwards compat*/
.autocomplete ul li a:hover .autocomplete-anchor-label,
.autocomplete ul li.focus-list a span {
  /*backwards compat*/
  color: $color-white;
}

.close {
  position: absolute;
  right: 0px;
  z-index: 2000;
}

/*.showAll-transition{
  opacity: 1;
  height: 50px;
  overflow: hidden;
}

.showAll-enter{
  opacity: 0.3;
  height: 0;
}

.showAll-leave{
  display: none;
}*/

input[invalid='true'] {
  box-shadow: 0 0 0 0.2rem $color-red;
  border: 1px solid red;
}
.autocomplete-wrap {
  border: 2px solid $color-gray--normal !important;
}
.autocomplete-wrap input:focus {
  outline: none;
  box-shadow: none;
  border: 1px solid $color-gray-4;
}
.autocomplete-wrap-focus {
  border-color: $color-blue--light;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  border-color: $color-blue--x-light !important;
}
.input-group.autocomplete-wrap {
  border: 1px solid $color-gray-4;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.autocomplete-parent-focus .input-group {
  border: 1px solid $color-gray-4;
  border-radius: 4px 0 0 4px;
}
.input-group.autocomplete-wrap input,
.input-group-append button {
  border: none;
}
.input-group-append button:focus {
  outline: none;
  box-shadow: none;
}

.searchbutton {
  border-radius: 0 4px 4px 0;
}

.invalid {
  box-shadow: 0 0 0 0.2rem $color-red;
  border: none;
  border-radius: 4px;
}
input[invalid='true'] {
  box-shadow: none;
}

.highlight {
  font-weight: bold;
  background-color: initial;
}
</style>
