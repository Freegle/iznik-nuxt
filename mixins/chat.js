import chatCollate from '@/mixins/chatCollate.js'
import twem from '~/assets/js/twem'
import { ADDRESS_WORDS, DAY_WORDS } from '~/utils/constants'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  mixins: [chatCollate],
  data: function() {
    return {
      lastFetched: new Date(),
      complete: false,
      sendmessage: null,
      distance: 1000,
      likelymsg: null,
      ouroffers: null,
      sending: false,
      scrolledToBottom: false,
      chatBusy: false,
      uploading: false,
      imageid: null,
      showNotices: true,
      RSVP: false,
      notVisible: false,
      contactGroup: null,
      urlid: null,
      showSpamModal: false,
      showMicrovolunteering: false
    }
  },
  computed: {
    enterNewLine() {
      const modtools = this.$store.getters['misc/get']('modtools')
      const val = this.$store.getters['misc/get'](
        modtools ? 'enternewlinemt' : 'enternewline'
      )

      return modtools ? !val : val
    },
    chat() {
      const ret = this.$store.getters['chats/get'](this.id)
      return ret
    },
    unseen() {
      let unseen = 0
      const chat = this.$store.getters['chats/get'](this.id)

      if (chat) {
        unseen = chat.unseen
      }

      return unseen
    },
    chatmessages() {
      const msgs = this.$store.getters['chatmessages/getMessages'](this.id)
      return this.chatCollate(msgs)
    },
    mymessages() {
      return this.chatmessages.filter(m => m.userid === this.myid)
    },
    lastfromme() {
      let last = 0

      this.mymessages.forEach(m => {
        last = Math.max(last, new Date(m.date).getTime())
      })

      return last
    },
    tooSoonToNudge() {
      return (
        this.lastfromme > 0 &&
        new Date().getTime() - this.lastfromme < 24 * 60 * 60 * 1000
      )
    },
    chatusers() {
      // This is a bit expensive in the store, so it's better to get it here and pass it down than potentially to
      // get it in each message we render.
      return this.$store.getters['chatmessages/getUsers'](this.id)
    },
    badratings() {
      let ret = false

      if (
        this.otheruser &&
        this.otheruser.info &&
        this.otheruser.info.ratings &&
        this.otheruser.info.ratings.Down > 2 &&
        this.otheruser.info.ratings.Down > 2 * this.otheruser.info.ratings.Up
      ) {
        ret = true
      }

      return ret
    },
    expectedreply() {
      let ret = 0

      if (this.otheruser && this.otheruser.info) {
        ret = this.otheruser.info.expectedreply
      }

      return ret
    },
    milesaway() {
      return this.otheruser && this.otheruser.info
        ? this.otheruser.info.milesaway
        : null
    },
    replytime() {
      let ret = null
      let secs = null

      if (this.otheruser && this.otheruser.info) {
        secs = this.otheruser.info.replytime
      }

      if (secs) {
        if (secs < 60) {
          ret = Math.round(secs) + ' second'
        } else if (secs < 60 * 60) {
          ret = Math.round(secs / 60) + ' minute'
        } else if (secs < 24 * 60 * 60) {
          ret = Math.round(secs / 60 / 60) + ' hour'
        } else {
          ret = Math.round(secs / 60 / 60 / 24) + ' day'
        }

        if (ret.indexOf('1 ') !== 0) {
          ret += 's'
        }
      }

      return ret
    },
    otheruserid() {
      // The user who isn't us.
      let ret = null

      if (this.chat && this.me) {
        if (this.chat.chattype === 'User2User' && this.chat.user1 && this.me) {
          ret =
            this.chat.user1 && this.chat.user1.id === this.me.id
              ? this.chat.user2.id
              : this.chat.user1.id
        } else if (
          this.chat.chattype === 'User2Mod' &&
          this.chat.user1 &&
          this.me.id !== this.chat.user1.id
        ) {
          // We are a mod.
          ret = this.chat.user1.id
        }
      }

      return ret
    },
    otheruser() {
      // We get this from the store rather than the chat object, because we fetched it in fetchChat, and
      // that copy has more info, which we need.
      let user = null

      if (this.otheruserid) {
        user = this.$store.getters['user/get'](this.otheruserid)

        if (user) {
          // We need this set as ModSpammerReport requires it.
          user.userid = this.otheruserid
        }
      }

      return user
    },
    spammer() {
      let ret = false

      if (
        this.otheruser &&
        this.otheruser.spammer &&
        this.otheruser.spammer.collection !== 'Whitelisted'
      ) {
        ret = this.otheruser.spammer
      }

      return ret
    },
    openInterested() {
      // Does this chat refer to any messages which belong to us and which are still open?
      let ret = false

      this.chatmessages.forEach(m => {
        if (
          m.type === 'Interested' &&
          m.refmsg &&
          m.refmsg.type === 'Offer' &&
          typeof m.refmsg === 'object' &&
          m.refmsg.fromuser.id === this.myid &&
          m.refmsg.availablenow &&
          (!m.refmsg.outcomes || m.refmsg.outcomes.length === 0) &&
          !this.promisedToMe(m.refmsg.id)
        ) {
          ret = m.refmsg.id
        }
      })

      return ret
    },
    promisedRecently() {
      // Does this chat have any recent promises.
      let ret = false

      this.chatmessages.forEach(m => {
        if (new Date().getTime() - new Date(m.date) < 5 * 24 * 60 * 60 * 1000) {
          if (m.type === 'Promised') {
            ret = m.refmsg.id
          }
        }
      })

      return ret
    },
    sentAddress() {
      const ret = this.mymessages.find(m => {
        if (new Date().getTime() - new Date(m.date) < 5 * 24 * 60 * 60 * 1000) {
          // If we've sent an address that's a giveaway.
          if (m.type === 'Address') {
            return true
          }

          // See if we've probably sent an address just by typing.
          if (
            ADDRESS_WORDS.find(w => {
              const re = new RegExp('\\b' + w + '\\b', 'gi')
              if (m.message && m.message.match(re)) {
                return true
              }
            })
          ) {
            return true
          }
        }
      })

      return ret
    },
    discussedDate() {
      let ret = null

      // Only look if I've been talking recently to avoid picking up old dates.
      if (
        this.lastfromme > 0 &&
        new Date().getTime() - this.lastfromme < 5 * 24 * 60 * 60 * 1000
      ) {
        // Look for a mention of a day.
        this.mymessages.forEach(m => {
          if (
            new Date().getTime() - new Date(m.date) <
            5 * 24 * 60 * 60 * 1000
          ) {
            const dayword = DAY_WORDS.find(w => {
              const re = new RegExp('\\b' + w + '\\b', 'gi')
              if (m.message && m.message.match(re)) {
                return true
              }
            })

            if (dayword) {
              // We found a day word.  Guess which date it means.
              switch (dayword) {
                case 'today':
                case 'this afternoon':
                case 'this evening':
                case 'tonight':
                  ret = this.$dayjs()
                  break
                case 'tomorrow':
                  ret = this.$dayjs().add(1, 'day')
                  break
                default:
                  for (let i = 0; i < 7; i++) {
                    const date = this.$dayjs().add(i, 'day')
                    if (
                      date.format('dd').toLowerCase() ===
                      dayword.substring(0, 2).toLowerCase()
                    ) {
                      ret = date
                    }
                  }
              }
            }
          }
        })
      }

      return ret
    },
    discussedDay() {
      return this.discussedDate ? this.discussedDate.format('dddd Do') : null
    },
    showHandoverPrompt() {
      const nothandover = this.$store.getters['misc/get']('nothandover')

      // We want to show it if:
      // - we've not hidden it
      // - we've got an offer which is still open
      // - we're talking about dates or addresses
      // - we've not promised recently
      return (
        this.otheruser &&
        this.openInterested &&
        (this.discussedDate || this.sentAddress) &&
        this.chat &&
        !this.promisedRecently &&
        (!nothandover || nothandover.indexOf(this.chat.id) === -1)
      )
    }
  },
  async beforeMount() {
    await this.fetchChat()
  },
  methods: {
    showInfo() {
      this.waitForRef('profile', () => {
        this.$refs.profile.show()
      })
    },
    scrollToBottom(force) {
      if (!this.scrolledToBottom || force) {
        // First load.  Scroll to the bottom when things have sorted themselves out.  This helps if we have messages
        // in our store, so we'll render some, otherwise we are stuck at the top until this fetch completes and we
        // scroll to the bottom below.
        this.waitForRef('chatContent', () => {
          setTimeout(() => {
            const container = this.$refs.chatContent

            if (container) {
              container.scrollTop = container.scrollHeight
            }
          }, 500)
        })

        this.scrolledToBottom = true
      }
    },
    loadMore: async function($state) {
      const currentContext = JSON.stringify(
        this.$store.getters['chatmessages/getContext'](this.id)
      )

      this.scrollToBottom()

      if (this.complete) {
        $state.complete()
      } else {
        this.busy = true

        try {
          await this.$store.dispatch('chatmessages/fetch', {
            chatid: this.id
          })

          try {
            this.lastFetched = new Date()
            this.scrollToBottom()

            const newContext = JSON.stringify(
              this.$store.getters['chatmessages/getContext'](this.id)
            )

            if (
              currentContext !== 'null' &&
              newContext.localeCompare(currentContext)
            ) {
              this.complete = true
              $state.complete()
            } else {
              $state.loaded()
            }

            this.busy = false
          } catch (e) {
            console.error(e)
          }
        } catch (e) {
          console.error(e)
          this.busy = false
          $state.complete()
        }
      }
    },
    newline: function() {
      const p = this.$refs.chatarea.selectionStart
      if (p) {
        this.sendmessage =
          this.sendmessage.substring(0, p) +
          '\n' +
          this.sendmessage.substring(p)
      } else {
        this.sendmessage += '\n'
      }
    },
    _updateAfterSend: async function() {
      this.chatBusy = false
      this.sending = false
      this.lastFetched = new Date()

      this.$emit('scrollbottom')
      this.scrollToBottom(true)

      // We also want to trigger an update in the chat list.
      await this.$store.dispatch('chats/fetch', {
        id: this.id
      })
    },
    send: async function() {
      let msg = this.sendmessage

      if (msg) {
        this.sending = true

        // If the current last message in this chat is an "interested" from the other party, then we're going to ask
        // if they expect a reply.
        const RSVP =
          this.chatmessages.length &&
          this.chatmessages[this.chatmessages.length - 1].type ===
            'Interested' &&
          this.chatmessages[this.chatmessages.length - 1].userid !==
            this.myid &&
          this.chat.chattype === 'User2User'

        // Encode up any emojis.
        msg = twem.untwem(msg)

        // Send it
        await this.$store.dispatch('chatmessages/send', {
          roomid: this.id,
          message: msg
        })

        // Clear the message now it's sent.
        this.sendmessage = ''

        await this._updateAfterSend()

        if (RSVP) {
          this.RSVP = true
          this.waitForRef('rsvp', () => {
            this.$refs.rsvp.show()
          })
        } else {
          // We've sent a message.  This would be a good time to do some microvolunteering.
          this.showMicrovolunteering = true
        }
      }
    },
    notHandover() {
      if (this.chat) {
        // We don't want to keep asking.  Keep a bounded number of the chat ids in local storage to prevent that.
        let nothandover = this.$store.getters['misc/get']('nothandover')
        nothandover = nothandover ? JSON.parse(nothandover) : []

        if (nothandover.length > 9) {
          nothandover = nothandover.slice(0, 9)
        }

        nothandover.push(this.chat.id)

        this.$store.dispatch('misc/set', {
          key: 'nothandover',
          value: JSON.stringify(nothandover)
        })
      }
    },
    promise: function(date) {
      if (!this.showHandoverPrompt) {
        // Make sure we're not suppressing the handover prompt - the fact that they have promised now overrides their
        // earlier decision to hide it.
        let nothandover = this.$store.getters['misc/get']('nothandover')
        nothandover = nothandover ? JSON.parse(nothandover) : []
        nothandover = nothandover.filter(h => h !== this.chat.id)
        this.$store.dispatch('misc/set', {
          key: 'nothandover',
          value: JSON.stringify(nothandover)
        })
      }

      // Show the modal first, as eye candy.
      this.waitForRef('promise', () => {
        this.$refs.promise.show(date)

        this.$nextTick(async () => {
          // Get our offers.
          const me = this.$store.getters['auth/user']
          await this.$store.dispatch('messages/clear')
          await this.$store.dispatch('messages/fetchMessages', {
            fromuser: me.id,
            types: ['Offer'],
            hasoutcome: false,
            limit: 100,
            collection: 'AllUser'
          })

          this.ouroffers = this.$store.getters['messages/getAll']

          // Find the last message referenced in this chat, if any.  That's the most likely one you'd want to promise,
          // so it should be the default.
          this.likelymsg = 0

          for (const msg of this.chatmessages) {
            if (msg.refmsg) {
              // Check that it's still in our list of messages
              for (const ours of this.ouroffers) {
                if (
                  ours.id === msg.refmsg.id &&
                  !ours.promised &&
                  (!ours.outcomes || ours.outcomes.length === 0)
                ) {
                  this.likelymsg = msg.refmsg.id
                }
              }
            }
          }

          this._updateAfterSend()
        })
      })
    },
    nudge() {
      this.waitForRef('nudgewarning', () => {
        this.$store.dispatch('misc/set', {
          key: 'nudge',
          value: true
        })

        this.$refs.nudgewarning.show()
      })
    },
    nudgeTooSoon() {
      this.waitForRef('nudgetoosoonwarning', () => {
        this.$refs.nudgetoosoonwarning.show()
      })
    },
    async doNudge() {
      await this.$store.dispatch('chatmessages/nudge', {
        roomid: this.id
      })

      this._updateAfterSend()
    },
    async markRead() {
      await this.$store.dispatch('chats/markSeen', {
        id: this.id
      })

      this._updateAfterSend()
    },
    addressBook() {
      this.$refs.addressModal.show()
    },
    sendAddress(id) {
      this.$store
        .dispatch('chatmessages/send', {
          roomid: this.id,
          addressid: id
        })
        .then(this._updateAfterSend)
    },
    async fetchChat() {
      // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
      // need to render this pane on the server.
      await this.$store.dispatch('chats/fetch', {
        id: this.id
      })

      const chat = this.$store.getters['chats/get'](this.id)

      this.notVisible = false

      if (chat) {
        await this.$store.dispatch('chatmessages/clearContext', {
          chatid: this.id
        })

        let msgs = this.$store.getters['chatmessages/getMessages'](this.id)

        if (msgs.length) {
          // We have some messages in the store.  This can make us look zippy, so we want to use them if possible.
          // But there might be new messages since we last updated our store.  We can't rely on
          // infinite scroll to pick them up, because that's at the top of a chat and any messages we are missing
          // will be at the bottom.
          //
          // So we want to fetch existing messages.  If we stop finding new messages then we know we're done.
          // But if we find that we're fetching too many, just bail out and clear the store to let infinite scroll
          // handle it.  This avoids accidentally working back to the start of time.
          const initialCount = msgs.length
          let count

          do {
            msgs = this.$store.getters['chatmessages/getMessages'](this.id)
            count = msgs.length

            await this.$store.dispatch('chatmessages/fetch', {
              chatid: this.id
            })

            msgs = this.$store.getters['chatmessages/getMessages'](this.id)
          } while (msgs.length !== count && count - initialCount < 50)

          if (count - initialCount >= 50) {
            // This seems to be dragging on. Bail out.
            await this.$store.dispatch('chatmessages/clearMessages', {
              chatid: this.id
            })
          }
        }

        if (this.otheruserid) {
          // Get the user info in case we need to warn about them.
          const user = this.$store.getters['user/get'](this.otheruserid)

          if (!user || !user.info) {
            await this.$store.dispatch('user/fetch', {
              id: this.otheruserid,
              info: true
            })
          }

          setTimeout(() => {
            this.showNotices = false
          }, 30000)
        }
      } else {
        // Invalid chat id
        this.notVisible = true
      }
    },
    async block() {
      await this.$store.dispatch('chats/block', {
        id: this.id
      })

      this.$router.push('/chats')
    },
    report() {
      this.$refs.chatreport.show()
    },
    spamReport() {
      this.showSpamModal = true
      this.waitForRef('spamConfirm', () => {
        this.$refs.spamConfirm.show()
      })
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // processed callback below.
      this.uploading = true
    },
    async photoProcessed(imageid, imagethumb, image) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      // Show the chat busy indicator.
      this.chatBusy = true

      // We have uploaded a photo.  Post a chatmessage referencing it.
      await this.$store
        .dispatch('chatmessages/send', {
          roomid: this.id,
          imageid: imageid
        })
        .then(this._updateAfterSend)
    },
    showhide() {
      this.waitForRef('chathide', () => {
        this.$refs.chathide.show()
      })
    },
    showblock() {
      this.waitForRef('chatblock', () => {
        this.$refs.chatblock.show()
      })
    },
    promisedToMe(msgid) {
      let ret = false

      this.mymessages.forEach(m => {
        if (m.type === 'Promised' && m.refmsg && m.refmsg.id === msgid) {
          ret = true
        }
      })

      return ret
    }
  },
  watch: {
    async unseen(newVal, oldVal) {
      // The unseen count will get changed by reactivity from the store.  If that's the chat we have in our pane
      // then that will trigger this watch, which we can use to pick up the new message.
      if (newVal > oldVal) {
        // New unread message.  Pick it up.
        await this.$store.dispatch('chatmessages/clearContext', {
          chatid: this.id
        })
        await this.$store.dispatch('chatmessages/fetch', {
          chatid: this.id
        })

        this.scrollToBottom(true)
      }
    }
  }
}
