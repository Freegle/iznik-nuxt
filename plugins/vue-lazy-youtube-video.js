import Vue from 'vue'
import { Plugin } from 'vue-lazy-youtube-video/dist/vue-lazy-youtube-video.esm'
// // have to import ejected style directly, see this issue https://github.com/vuejs/rollup-plugin-vue/issues/266
import 'vue-lazy-youtube-video/dist/style.css'

Vue.use(Plugin)
