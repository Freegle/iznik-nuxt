const NchanSubscriber = require('nchan')

export default {
  data: function() {
    return {
      nchan: null
    }
  },
  watch: {
    localMe(newVal, oldVal) {
      if (this.nchan && this.nchan.running) {
        // Stop old listen.
        try {
          this.nchan.stop()
        } catch (e) {}
      }

      this.nchan = null

      if (newVal) {
        // We are now logged in.
        console.log('Start NCHAN from watch')
        this.startNCHAN(newVal.id)
      }
    }
  },
  mounted() {
    // Get me directly as the computed property might not be available
    const me = this.$store.getters['auth/user']

    if (me && me.id) {
      console.log('Start NCHAN from mount')
      this.startNCHAN(me.id)
    }
  },
  beforeDestroy() {
    if (this.nchan && this.nchan.running) {
      console.log('Stop NCHAN')
      try {
        this.nchan.stop()
      } catch (e) {}
    }

    this.nchan = null
  },
  computed: {
    // There should also be a global me property but define a local one to make sure it is present
    localMe() {
      return this.$store.getters['auth/user']
    }
  },
  methods: {
    startNCHAN(id) {
      console.log('NCHAN COMMENTED OUT IS_APP')
      return
      this.nchan = new NchanSubscriber(
        process.env.CHAT_HOST + '/subscribe?id=' + id,
        {
          subscriber: ['longpoll']
        }
      )

      // We store the last message we got from NCHAN.  This avoids us getting duplicate messages (triggering server
      // work) when we load up.
      const lastNCHAN = this.$store.getters['auth/nchan']

      if (lastNCHAN) {
        this.nchan.lastMessageId = lastNCHAN.id
      }

      // Disabled for now until things settle down.
      console.log('Not starting NCHAN')
      // this.nchan.start()

      this.nchan.on('error', function(code, descr) {
        console.error('NCHAN error', code, descr)
      })

      this.nchan.on('message', async (ret, meta) => {
        console.log('NCHAN', ret, meta)

        if (meta.id) {
          this.$store.dispatch('auth/setNCHAN', {
            id: meta.id
          })
        }

        if (ret) {
          ret = JSON.parse(ret)

          // We will get notified for both MT and FD chats.  But we only want to react to
          // the one which this client actually is.
          const mt =
            ret && Object.keys(ret).includes('modtools') ? ret.modtools : false

          if (!mt && ret && ret.text) {
            const data = ret.text

            if (data) {
              if (data.newroom) {
                // We have been notified that we are now in a new chat.  Load it into the store; once we've
                // done that then anything else needed will follow.
                console.log('Load new room', data.newroom)
                await this.$store.dispatch('chats/fetch', {
                  id: data.newroom
                })
              } else if (data.roomid) {
                // Activity on this room.  Fetch it.
                console.log('Activity on room', data.roomid)
                await this.$store.dispatch('chats/fetch', {
                  id: data.roomid
                })
              }
            }
          }
        }
      })
    }
  }
}
