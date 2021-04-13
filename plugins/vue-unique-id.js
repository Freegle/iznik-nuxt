import Vue from 'vue'
import uniqueId from 'vue-unique-id'

Vue.use(uniqueId, {
  uidProperty: 'autoUniqueId'
})
