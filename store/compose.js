// TODO There's way too much boilerplate code in here.  I've seen talk of best practice being to wrap mutations in
// actions, which isn't helping.  And then there's mapState/mapMutations/mapActions.  Surely we can do better?
import Vue from 'vue'

// We allow composing of multiple posts for the same location/email, so messages and attachments are indexed by
// id.  The id is a client-only index; it becomes a real id once the items are posted.
export const state = () => ({
  email: null,
  emailAt: null,
  postcode: null,
  group: null,
  messages: {},
  attachments: {},
  submitting: 0
})

export const mutations = {
  clear(state) {
    state.messages = {}
    state.attachments = {}
  },

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
    Vue.set(state.messages, message.id, message)
  },
  setItem(state, params) {
    console.log('Set item', params)
    Vue.set(
      state.messages,
      params.id,
      state.messages[params.id] ? state.messages[params.id] : {}
    )
    Vue.set(state.messages[params.id], 'item', params.item)
    Vue.set(state.messages[params.id], 'type', params.type)
    Vue.set(state.messages[params.id], 'id', params.id)
  },
  setDescription(state, params) {
    Vue.set(
      state.messages,
      params.id,
      state.messages[params.id] ? state.messages[params.id] : {}
    )
    Vue.set(state.messages[params.id], 'description', params.description)
    Vue.set(state.messages[params.id], 'id', params.id)
  },
  addAttachment(state, params) {
    Vue.set(
      state.attachments,
      params.id,
      state.attachments[params.id] ? state.attachments[params.id] : []
    )
    state.attachments[params.id].push(params.attachment)
  },
  removeAttachment(state, params) {
    console.log('Remove att', params)
    Vue.set(
      state.attachments,
      params.id,
      state.attachments[params.id].filter(obj => {
        return parseInt(obj.id) !== parseInt(params.photoid)
      })
    )
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
  getMessage: state => id => {
    return state.messages[id]
  },
  getMessages: state => () => {
    return state.messages
  },
  getAttachments: state => id => {
    return state.attachments[id] ? state.attachments[id] : []
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
  setItem({ commit }, params) {
    commit('setItem', params)
  },
  setDescription({ commit }, params) {
    commit('setDescription', params)
  },
  addAttachment({ commit }, params) {
    commit('addAttachment', params)
  },
  removeAttachment({ commit }, params) {
    commit('removeAttachment', params)
  },
  async submit({ commit, state }) {
    // This is the most important bit of code in the client :-).  We have our messages in the compose store.  The
    // server has a two stage process - create a draft and submit it, so that's what we do.
    //
    // In earlier client versions, we remembered existing drafts in case of interruption by user or errors.
    // But we don't need to do that, because our store remembers the contents of the message.  Orphaned drafts will
    // be pruned by the server.
    const promises = []
    const ids = []
    const self = this

    for (const [id, message] of Object.entries(state.messages)) {
      if (message.submitted) {
        continue
      }

      console.log('Submit', id, message, state.attachments[message.id])
      const attids = []

      if (state.attachments[message.id]) {
        for (const att in state.attachments[message.id]) {
          console.log('Got att', att)
          attids.push(state.attachments[message.id][att].id)
        }
      }

      const data = {
        collection: 'Draft',
        locationid: state.postcode.id,
        messagetype: message.type,
        item: message.item,
        textbody: message.description,
        attachments: attids,
        groupid: state.group
      }

      const promise = new Promise(function(resolve, reject) {
        self.$axios
          .put(process.env.API + '/message', data)
          .then(function(ret) {
            if (ret.status === 200 && ret.data.ret === 0) {
              // We've created a draft.  Submit it
              self.$axios
                .post(process.env.API + '/message', {
                  action: 'JoinAndPost',
                  email: state.email,
                  id: ret.data.id
                })
                .then(function(ret2) {
                  if (ret2.status === 200 && ret2.data.ret === 0) {
                    // Success
                    const id = ret2.data.id
                    commit('setMessage', {
                      id: message.id,
                      submitted: true
                    })
                    commit('setAttachments', [])
                    ids.push(id)
                    resolve()
                  }
                })
                .catch(function(e) {
                  // Failed
                  console.error('Post of message failed', e)
                  reject(e)
                })
            } else {
              console.error('Create of message failed', ret)
              reject(ret)
            }
          })
          .catch(function(e) {
            // TODO
            console.error('Create of message failed', e)
          })
      })

      promises.push(promise)
    }

    await Promise.all(promises)
    commit('clear')
    console.log('Returning ids', ids)
    return ids
  }
}
