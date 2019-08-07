// TODO There's way too much boilerplate code in here.  I've seen talk of best practice being to wrap mutations in
// actions, which isn't helping.  And then there's mapState/mapMutations/mapActions.  Surely we can do better?
export const state = () => ({
  email: null,
  emailAt: null,
  postcode: null,
  group: null,
  message: {},
  attachments: []
})

export const mutations = {
  setEmail(state, email) {
    state.email = email
    state.emailAt = new Date().getTime()
  },
  setPostcode(state, postcode) {
    state.postcode = postcode
  },
  setGroup(state, group) {
    state.group = group
  },
  setMessage(state, message) {
    state.message = message
  },
  setItem(state, item) {
    state.message.item = item
  },
  setDescription(state, description) {
    state.message.description = description
  },
  addAttachment(state, attachment) {
    state.attachments.push(attachment)
  },
  removeAttachment(state, id) {
    state.attachments = state.attachments.filter(obj => {
      return parseInt(obj.id) !== parseInt(id)
    })
  }
}

export const getters = {
  getEmail: state => () => {
    return state.email
  },
  getEmailAt: state => () => {
    return state.emailAt
  },
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
  setEmail({ commit }, email) {
    commit('setEmail', email)
  },
  setPostcode({ commit }, postcode) {
    commit('setPostcode', postcode)
  },
  setGroup({ commit }, group) {
    commit('setGroup', group)
  },
  setMessage({ commit }, message) {
    commit('setMessage', message)
  },
  setItem({ commit }, item) {
    commit('setItem', item)
  },
  setDescription({ commit }, description) {
    commit('setDescription', description)
  },
  addAttachment({ commit }, attachment) {
    commit('addAttachment', attachment)
  },
  removeAttachment({ commit }, attachment) {
    commit('removeAttachment', attachment)
  },
  async submit({ commit, state }) {
    // This is the most important bit of code in the client :-).  We have our message in the compose store.  The
    // server has a two stage process - create a draft and submit it, so that's what we do.
    //
    // In earlier client versions, we remembered existing drafts in case of interruption by user or errors.
    // But we don't need to do that, because our store remembers the contents of the message.  Orphaned drafts will
    // be pruned by the server.
    const attids = []
    for (const att in state.attachments) {
      attids.push(state.attachments[att].id)
    }

    const data = {
      collection: 'Draft',
      locationid: state.postcode.id,
      messagetype: state.message.type,
      item: state.message.item,
      textbody: state.message.description,
      attachments: attids,
      groupid: state.group
    }

    let id = null
    try {
      const ret = await this.$axios.put(process.env.API + '/message', data)
      console.log('Submit returned', ret)

      if (ret.status === 200 && ret.data.ret === 0) {
        // We've created a draft.  Submit it
        const ret2 = await this.$axios.post(process.env.API + '/message', {
          action: 'JoinAndPost',
          email: state.email,
          id: ret.data.id
        })

        if (ret.status === 200 && ret.data.ret === 0) {
          // Success
          console.log('Posted', id)
          id = ret2.data.id
          commit('setMessage', {})
          commit('setAttachments', [])
        }
      } else {
        // TODO
      }
    } catch (e) {
      // TODO
      console.error('Submit failed', e)
    }

    return id
  }
}
