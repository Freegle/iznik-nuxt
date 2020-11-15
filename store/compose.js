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
  max: 4,
  uploading: false,
  lastSubmitted: 0
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
          type: group.type,
          settings: {
            closed: group.settings.closed
          }
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

    if (message && message.submitted) {
      state.lastSubmitted = Math.max(
        state.lastSubmitted ? state.lastSubmitted : 0,
        message.id
      )
    }
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
    if (!state.messages[params.id]) {
      Vue.set(state.messages, params.id, {
        id: params.id
      })
    }

    Vue.set(state.messages[params.id], 'item', params.item)
    Vue.set(state.messages[params.id], 'type', params.type)
    Vue.set(state.messages[params.id], 'availablenow', params.availablenow)
  },
  setDescription(state, params) {
    if (!state.messages[params.id]) {
      Vue.set(state.messages, params.id, {
        id: params.id
      })
    }

    Vue.set(state.messages[params.id], 'description', params.description)
    Vue.set(state.messages[params.id], 'type', params.type)
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
  setUploading(state, value) {
    state.uploading = value
  }
}

export const getters = {
  getUploading: state => {
    return state.uploading
  },
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
  },
  lastSubmitted: state => {
    return state.lastSubmitted
  }
}

function calculateSteps(messages, type, drafts, commit) {
  let steps = 0
  console.log('Calculate steps', messages, type)

  // eslint-disable-next-line no-unused-vars
  for (const [id, message] of messages) {
    if (message.type === type && !message.submitted) {
      if (message.id < 0) {
        // 1) Create draft 2) Submit
        steps += 2
      } else {
        // 1) Edit message 2) Convert to draft 3) Submit
        steps += 3
      }
    }
  }

  console.log('Steps', steps)

  // Add an extra step to be used immediately to show we've started.
  commit('initProgress', steps + 1)
}

async function createDraft(message, email, state, commit) {
  console.log('Create draft', message, email)
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
    availablenow: message.availablenow,
    attachments: attids,
    groupid: state.group,
    email: email
  }

  console.log('Data for put', data)
  const { id } = await this.$api.message.put(data)
  console.log('Returned', id)
  commit('incProgress')
  return id
}

async function submitDraft(id, email, commit) {
  console.log('Submit draft', id, email)
  const ret = await this.$api.message.joinAndPost(id, email)
  console.log('Returned', ret)
  commit('incProgress')
  return ret
}

function markSubmitted(id, commit) {
  console.log('Mark submitted', id)
  commit('setMessage', {
    id: id,
    submitted: true,
    item: null,
    description: null,
    availablenow: 1
  })

  commit('setAttachmentsForMessage', {
    id: id,
    attachments: []
  })
}

async function backToDraft(id, dispatch, commit) {
  console.log('Back to draft', id)
  await dispatch(
    'messages/update',
    {
      id: id,
      action: 'RejectToDraft'
    },
    {
      root: true
    }
  )

  commit('incProgress')
}

async function updateIt(
  id,
  locationid,
  messagetype,
  item,
  textbody,
  availablenow,
  groupid,
  dispatch,
  commit
) {
  const data = {
    id,
    locationid,
    messagetype,
    item,
    textbody,
    groupid,
    availablenow
  }

  console.log('Update it', data)

  await dispatch('messages/patch', data, {
    root: true
  })

  commit('incProgress')
}

export const actions = {
  setUploading({ commit }, value) {
    commit('setUploading', value)
  },
  setEmail({ commit }, email) {
    commit('setEmail', email)
  },
  setPostcode({ commit }, postcode) {
    commit('setPostcode', postcode)
  },
  setGroup({ commit }, group) {
    commit('setGroup', group)
  },
  clearMessages({ commit }, email) {
    commit('clear', email)
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
    commit('clearMessage', params)
  },

  async saveDraft({ dispatch, commit, state, store }, params) {
    const messages = Object.entries(state.messages)
    console.log('Save drafts', messages, params.type)

    calculateSteps(messages, params.type, true, commit)

    // Before we do anything, give a spurious sense of progress.
    commit('incProgress')

    for (const [id, message] of messages) {
      if (message.type === params.type && !message.submitted) {
        console.log(
          'Save draft message',
          id,
          message,
          state.attachments[message.id]
        )

        if (message.id < 0) {
          // This is a draft we have composed on the client, which doesn't have a corresponding server message yet.
          // We need to:
          // - create a drafted
          // - submit it
          // - mark it in our store as submitted.
          console.log('Draft', params.email)
          await createDraft.call(this, message, params.email, state, commit)
        } else {
          // This is one of our existing messages which we are reposting.  We need to convert it back to a draft,
          // edit it (to update it from our client data), and then submit.
          console.log('Existing message')
          const id = message.id
          await backToDraft(id, dispatch, commit)
          await updateIt(
            id,
            state.postcode.id,
            message.type,
            message.item,
            message.description,
            'availablenow' in message ? message.availablenow : 1,
            state.group,
            dispatch,
            commit
          )
        }
      }
    }

    console.log('Done')
    commit('clear')
  },
  async submit({ dispatch, commit, state, store }, params) {
    // This is the most important bit of code in the client :-).  We have our messages in the compose store.
    //
    // For messages we've just created, the server has a two stage process - create a draft and submit it, so that's
    // what we do.
    //
    // For messages which we are reposting, we need to edit them to pick up updated, convert them back into a draft,
    // and then submit them.
    const results = []
    const messages = Object.entries(state.messages)
    console.log('Submit', messages, params.type)

    calculateSteps(messages, params.type, false, commit)

    // Before we do anything, give a spurious sense of progress.
    commit('incProgress')

    for (const [id, message] of messages) {
      if (message.type === params.type && !message.submitted) {
        console.log(
          'Submit message',
          id,
          message,
          state.attachments[message.id]
        )

        let result

        if (message.id < 0) {
          // This is a draft we have composed on the client, which doesn't have a corresponding server message yet.
          // We need to:
          // - create a drafted
          // - submit it
          // - mark it in our store as submitted.
          console.log('Draft')
          const id = await createDraft.call(
            this,
            message,
            state.email,
            state,
            commit
          )

          const { groupid, newuser, newpassword } = await submitDraft.call(
            this,
            id,
            state.email,
            commit
          )

          result = { id, groupid, newuser, newpassword }
        } else {
          // This is one of our existing messages which we are reposting.  We need to convert it back to a draft,
          // edit it (to update it from our client data), and then submit.
          console.log('Existing message')
          const id = message.id
          await backToDraft(id, dispatch, commit)
          await updateIt(
            id,
            state.postcode.id,
            message.type,
            message.item,
            message.description,
            'availablenow' in message ? message.availablenow : 1,
            state.group,
            dispatch,
            commit
          )

          const { groupid, newuser, newpassword } = await submitDraft.call(
            this,
            id,
            state.email,
            commit
          )

          result = { id, groupid, newuser, newpassword }
        }

        console.log('Got result', result)
        results.push(result)
        markSubmitted(result.id, commit)
      }
    }

    console.log('Done')
    commit('clear')

    // We might have done this logged out.  By the time it has completed we will have an account, so we want to make
    // sure that the login page pops up rather than the signup page.
    dispatch('auth/loggedInEver', true, {
      root: true
    })

    return results
  },
  async submitQueued({ dispatch, commit, state, store }, params) {
    const { id } = await submitDraft.call(this, params.id, params.email, commit)

    return id
  }
}
