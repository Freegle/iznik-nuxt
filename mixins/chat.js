import twem from '~/assets/js/twem'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
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
      showSpamModal: false
    }
  },
  computed: {
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
      const ret = this.chatCollate(msgs)
      return ret
    },

    chatusers() {
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
    availability() {
      this.waitForRef('availabilitymodal', () => {
        this.$refs.availabilitymodal.show()
      })
    },
    loadMore: function($state) {
      const currentCount = this.chatmessages.length

      if (!this.scrolledToBottom) {
        // First load.  Scroll to the bottom when things have sorted themselves out.  This helps if we have messages
        // in our store, so we'll render some, otherwise we are stuck at the top until this fetch completes and we
        // scroll to the bottom below.
        this.$nextTick(() => {
          if (this.$el && this.$el.querySelector) {
            const container = this.$el.querySelector('.chatContent')
            container.scrollTop = container.scrollHeight
          }
        })
      }

      if (this.complete) {
        $state.complete()
      } else {
        this.busy = true
        this.$store
          .dispatch('chatmessages/fetch', {
            chatid: this.id
          })
          .then(() => {
            try {
              this.lastFetched = new Date()

              if (!this.scrolledToBottom) {
                // First load.  Scroll to the bottom when things have sorted themselves out.
                this.$nextTick(() => {
                  if (this.$el && this.$el.querySelector) {
                    const container = this.$el.querySelector('.chatContent')
                    container.scrollTop = container.scrollHeight
                    this.scrolledToBottom = true
                  }
                })
              }

              if (currentCount === this.chatmessages.length) {
                this.complete = true
                $state.complete()
              } else {
                $state.loaded()
              }

              this.busy = false
            } catch (e) {
              console.error(e)
            }
          })
          .catch(e => {
            console.error(e)
            this.busy = false
            $state.complete()
          })
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

      // Scroll to the bottom so we can see it.
      this.$nextTick(() => {
        if (this.$el && this.$el.querySelector) {
          const container = this.$el.querySelector('.chatContent')
          container.scrollTop = container.scrollHeight
        }
      })

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
          this.chatmessages[this.chatmessages.length - 1].userid !== this.myid

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
        }
      }
    },
    promise() {
      // Show the modal first, as eye candy.
      this.$refs.promise.show()

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
              if (ours.id === msg.refmsg.id) {
                this.likelymsg = msg.refmsg.id
              }
            }
          }
        }

        this._updateAfterSend()
      })
    },
    async nudge() {
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
          await this.$store.dispatch('user/fetch', {
            id: this.otheruserid,
            info: true
          })

          setTimeout(() => {
            this.showNotices = false
          }, 30000)
        }
      } else {
        // Invalid chat id
        this.notVisible = true
      }
    },
    block() {
      this.$store.dispatch('chats/block', {
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
      this.$refs.chathide.show()
    },
    showblock() {
      this.$refs.chatblock.show()
    },
    hide() {
      this.$store.dispatch('chats/hide', {
        id: this.id
      })

      this.$router.push('/chats')
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

        setTimeout(() => {
          if (this.$el && this.$el.querySelector) {
            const container = this.$el.querySelector('.chatContent')
            if (container) {
              container.scrollTop = container.scrollHeight
            }
          }
        }, 500)
      }
    }
  }
}
