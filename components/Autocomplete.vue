<template>
  <div :class="`${getClassName('wrapper')} autocomplete-wrapper`">
    <b-input-group ref="ref_div" tabindex="0" class="ref-div">
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

      <b-input-group-append>
        <b-button variant="white" class="transbord">
          <!-- TODO RAHUL DESIGN The shadow on the input field that you get when you're focused ought really to include this append.-->
          <v-icon name="sync" :class="'text-success fa-spin ' + (ajaxInProgress ? 'visible': 'invisible')" />
        </b-button>
      </b-input-group-append>
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

<style scoped lang="scss">
@import 'color-vars';

.transbord {
  // TODO DESIGN MINOR This colour is copied from bootstrap $input-border-color and should be done better.  Sorry Jason.
  // See also LoginModal
  border-color: #ced4da;
  border-left: none;
}

/* iteminp class is passed into this component in a prop */
.iteminp ul {
  /* 
  width: 100% !important;
  right: 0px !important;
  margin-right: 15px !important;
  margin-left: 15px !important;
  */
  /*Width adjusted for the border of the search options*/
  width: 96% !important;
  right: 13px !important;
}

/* postcodelist class is passed into this component in a prop */
.postcodelist {
  z-index: 900;
}

.postcodelist li {
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
  background: $color-gray--lighter;
  padding: 0;
  margin: 0;
  display: inline-block;
  min-width: 15%;
  margin-top: 0px;
  z-index: 1000;
  right: 48%;
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

.autocomplete ul li a {
  text-decoration: none;
  display: block;
  padding: 5px;
  padding-left: 10px;
}

.autocomplete ul li a:hover,
.autocomplete ul li.focus-list a {
  color: white;
  background: $color-blue--lighter;
}

.autocomplete ul li a span, /*backwards compat*/
.autocomplete ul li a .autocomplete-anchor-label {
  display: block;
  margin-top: 3px;
  color: grey;
  font-size: 13px;
}

.autocomplete ul li a:hover .autocomplete-anchor-label,
.autocomplete ul li.focus-list a span, /*backwards compat*/
.autocomplete ul li a:hover .autocomplete-anchor-label,
.autocomplete ul li.focus-list a span {
  /*backwards compat*/
  color: white;
}


/*Style for border round the search options*/
.search_op {
  border: 1px solid #61ae25;
  border-radius: 0.2rem;
}

div .ref-div:focus {
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  border-radius: 0.2rem;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.focus-class:focus {
  border-color: #ced4da;
  border-right: none;
  -webkit-box-shadow: none;
  box-shadow: none;
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
</style>

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
    },
  },

  data() {
    return {
      showList: false,
      type: '',
      json: [],
      focusList: '',
      debounceTask: undefined,
      ajaxInProgress: null,
      ajaxDeferred: null
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

    // Netralize Autocomplete
    clearInput() {
      this.showList = false
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
      // Reset body height.  Seems to break unless we wait for a bit.
      setTimeout(() => {
        let body = document.getElementsByTagName("body")[0];
        body.classList.remove('forcescroll')
        body.style.overflowY = ''
      }, 500)

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

      // On mobile, the on screen keyboard can obscure the dropdown.  So:
      // - make sure we have room to scroll
      // - scroll this input to the top
      let body = document.getElementsByTagName("body")[0];
      body.classList.add('forcescroll')
      this.$refs.input.scrollTop = 0
      body.style.overflowY = 'hidden'

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
      const focusClass = i === this.focusList ? 'focus-list search_op' : ' search_op'
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
        const params = this.composeParams(val)
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
          const { responseText } = e.target
          console.log("About to parse", responseText)
          const json = JSON.parse(responseText)
          // Callback Event
          this.onAjaxLoaded ? this.onAjaxLoaded(json) : null
          this.json = this.process ? this.process(json) : json

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
    }
  }
}

/* eslint-enable */
</script>
