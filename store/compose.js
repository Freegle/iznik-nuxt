export const state = () => ({
  postcode: null,
  group: null,
  message: {},
  attachments: []
})

export const mutations = {
  setPostcode(state, postcode) {
    console.log('mutate postcode', postcode)
    state.postcode = postcode
  },
  setGroup(state, group) {
    console.log('mutate group', group)
    state.group = group
  },
  setMessage(state, message) {
    state.message = message
  },
  addAttachment(state, attachment) {
    state.attachments.push(attachment)
  },
  removeAttachment(state, attachment) {
    state.attachments = state.attachments.filter(obj => {
      return parseInt(obj.id) !== parseInt(attachment.id)
    })
  }
}

export const getters = {
  getPostcode: state => () => {
    return state.postcode
  },
  getGroup: state => () => {
    return state.group
  },
  getMessage: state => () => {
    return state.message
  },
  getAttachments: state => () => {
    return state.attachments
  }
}

export const actions = {
  setPostcode({ commit }, postcode) {
    commit('setPostcode', postcode)
  },
  setGroup({ commit }, group) {
    commit('setGroup', group)
  },
  setMessage({ commit }, message) {
    commit('setMessage', message)
  },
  addAttachment({ commit }, attachment) {
    commit('addAttachment', attachment)
  },
  removeAttachment({ commit }, attachment) {
    commit('removeAttachment', attachment)
  }
}
