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
  progress: 1,
  max: 4
})

export const mutations = {
  clear(state) {
    state.messages = {}
    state.attachments = {}
  },

  setEmail(state, email) {
    state.email = email
    state.emailAt = Date.now()
  },
  setPostcode(state, postcode) {
    // Want to make sure we don't store too much data.
    const pc = { ...postcode }

    if (postcode) {
      pc.groupsnear = []

      for (const group of postcode.groupsnear) {
        pc.groupsnear.push({
          id: group.id,
          nameshort: group.nameshort,
          namedisplay: group.namedisplay,
          type: group.type
        })
      }
    }

    state.postcode = pc
  },
  setGroup(state, group) {
    state.group = group
  },
  setMessage(state, message) {
    Vue.set(state.messages, message.id, message)
  },
  clearMessage: (state, params) => {
    Vue.delete(state.messages, params.id)
  },
  initProgress: (state, max) => {
    state.progress = 1
    state.max = max + 1
  },
  incProgress: state => {
    state.progress++
  },
  setItem(state, params) {
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
    Vue.set(
      state.attachments,
      params.id,
      state.attachments[params.id].filter(obj => {
        return parseInt(obj.id) !== parseInt(params.photoid)
      })
    )
  },
  setAttachmentsForMessage(state, params) {
    state.attachments[params.id] = params.attachments
  },
  setAttachments(state, params) {
    state.attachments = params
  }
}

export const getters = {
  getEmail: state => {
    return state.email
  },
  getEmailAt: state => {
    return state.emailAt
  },
  getPostcode: state => {
    return state.postcode
  },
  getGroup: state => {
    return state.group
  },
  getMessage: state => id => {
    return state.messages[id]
  },
  getMessages: state => {
    return state.messages
  },
  getAttachments: state => id => {
    return state.attachments[id] ? state.attachments[id] : []
  },
  getProgress: state => {
    return (Math.min(state.progress, state.max - 1) * 100) / state.max
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
  setAttachmentsForMessage({ commit }, params) {
    commit('setAttachmentsForMessage', params)
  },
  removeAttachment({ commit }, params) {
    commit('removeAttachment', params)
  },
  clearMessage({ commit }, params) {
    console.log('clear action', params)
    commit('clearMessage', params)
  },
  async submit({ dispatch, commit, state, store }) {
    // This is the most important bit of code in the client :-).  We have our messages in the compose store.
    //
    // For messages we've just created, the server has a two stage process - create a draft and submit it, so that's
    // what we do.
    //
    // For messages which we are reposting, we need to edit them to pick up updated, convert them back into a draft,
    // and then submit them.
    //
    // In earlier client versions, we recovered existing drafts from the server in case of interruption by user or errors.
    // But we don't need to do that, because our store remembers the contents of the message.  Orphaned drafts will
    // be pruned by the server.
    //
    // TODO MINOR Once the old client goes and we only have one set of code to worry about, we should simplify this into a
    // single server call.
    const promises = []
    const results = []
    const self = this
    const messages = Object.entries(state.messages)
    let steps = 0
    for (const message of messages) {
      if (message.id < 0) {
        // 1) Create draft 2) Submit
        steps += 2
      } else {
        // 1) Edit message 2) Convert to draft 3) Submit
        steps += 3
      }
    }

    // Add an extra step for below to show we've started.
    commit('initProgress', steps + 1)

    for (const [id, message] of messages) {
      if (message.submitted) {
        continue
      }

      console.log('Submit', id, message, state.attachments[message.id])
      let promise

      if (message.id < 0) {
        // This is a draft we have composed on the client, which doesn't have a corresponding server message yet.
        const attids = []

        if (state.attachments[message.id]) {
          for (const att in state.attachments[message.id]) {
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

        promise = new Promise((resolve, reject) => {
          console.log('Create draft')

          self.$api.message.put(data).then(({ id }) => {
            commit('incProgress')
            // We've created a draft.  Submit it
            console.log('Created draft, now submit', id)

            self.$api.message
              .joinAndPost(id, state.email)
              .then(({ groupid, newuser, newpassword }) => {
                commit('incProgress')
                // Success
                console.log('Submitted draft OK')
                commit('setMessage', {
                  id: message.id,
                  submitted: true,
                  item: null,
                  description: null
                })
                commit('setAttachments', [])
                results.push({
                  id: message.id,
                  groupid,
                  newuser,
                  newpassword
                })

                resolve(groupid)
              })
              .catch(function(e) {
                // Failed
                console.error('Post of message failed', e)
                reject(e)
              })
          })
        })
      } else {
        // This is one of our messages which we are reposting.  We need to edit it (to update it from our client
        // copy), convert it back to draft, and then submit.
        promise = new Promise(function(resolve, reject) {
          console.log('Existing message, update on server', message.id)
          dispatch('messages/patch', message, {
            root: true
          }).then(() => {
            commit('incProgress')

            console.log('Updated, now convert back to draft')
            dispatch(
              'messages/update',
              {
                id: message.id,
                action: 'RejectToDraft'
              },
              {
                root: true
              }
            ).then(() => {
              commit('incProgress')

              console.log('Updated, now submit')
              self.$api.message
                .joinAndPost(message.id, state.email)
                .then(({ groupid, newuser, newpassword }) => {
                  commit('incProgress')
                  console.log('Submitted')
                  // Success
                  commit('setMessage', {
                    id: message.id,
                    submitted: true,
                    item: null,
                    description: null
                  })
                  commit('setAttachments', [])
                  results.push({
                    id: message.id,
                    groupid,
                    newuser,
                    newpassword
                  })

                  resolve(groupid)
                })
                .catch(e => {
                  // Failed
                  console.error('Post of message failed', e)
                  reject(e)
                })
                .catch(e => {
                  console.error('Edit of existing message failed', e)
                })
            })
          })
        })
      }

      Vue.nextTick(() => {
        commit('incProgress')
      })

      promises.push(promise)
    }

    await Promise.all(promises)
    commit('clear')

    console.log('Submit returning', results)
    return results
  }
}
