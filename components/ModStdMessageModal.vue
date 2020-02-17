<template>
  <b-modal
    id="stdmsgmodal"
    v-model="showModal"
    :title="message.subject"
    no-stacking
    size="lg"
  >
    <template slot="default">
      <div class="d-flex">
        <div>
          From:&nbsp;
          <br>
          To:&nbsp;
        </div>
        <div>
          {{ fromName }}
          <br>
          {{ message.fromuser.displayname }}
          <span v-if="toEmail">
            &lt;{{ toEmail }}&gt;
          </span>
        </div>
      </div>
      <b-input v-model="subject" class="mt-2" />
      <b-textarea v-model="body" rows="10" class="mt-2" />
      <div v-if="stdmsg && stdmsg.newdelstatus !== 'UNCHANGED'" class="mt-1">
        <v-icon name="cog" />
        Change email frequency to <em>{{ emailfrequency }}</em>
      </div>
      <div v-if="stdmsg && stdmsg.newmodstatus !== 'UNCHANGED'" class="mt-1">
        <v-icon name="cog" />
        Change moderation status to <em>{{ modstatus }}</em>
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <b-btn variant="success" @click="process">
        {{ processLabel }}
      </b-btn>
      <b-button variant="white" @click="cancel">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    stdmsgid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showModal: false,
      subject: null,
      body: null,
      stdmsg: null,
      keywordList: ['Offer', 'Taken', 'Wanted', 'Received', 'Other'],
      recentDays: 31
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    },
    fromName() {
      return this.me.displayname
    },
    toEmail() {
      let ret = null
      this.message.fromuser.emails.forEach(email => {
        if (
          email.email &&
          email.email.indexOf('users.ilovefreegle.org') === -1 &&
          (ret === null || email.preferred)
        ) {
          ret = email.email
        }
      })

      return ret
    },

    groupid() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        ret = this.message.groups[0].groupid
      }

      return ret
    },
    processLabel() {
      if (this.stdmsg) {
        switch (this.stdmsg.action) {
          case 'Approve':
          case 'Approve Member':
            return 'Send and Approve'
          case 'Reject':
          case 'Reject Member':
            return 'Send and Reject'
          case 'Leave':
          case 'Leave Member':
          case 'Leave Approved Message':
          case 'Leave Approved Member':
            return 'Send and Leave'
          case 'Delete':
          case 'Delete Approved Message':
          case 'Delete Approved Member':
            return 'Send and Delete'
          case 'Edit':
            return 'Save Edit'
          default:
            return 'Unknown Action - Bug'
        }
      } else {
        return null
      }
    },
    modstatus() {
      if (this.stdmsg) {
        switch (this.stdmsg.newmodstatus) {
          case 'UNCHANGED':
            return 'Unchanged'
          case 'MODERATOED':
            return 'Moerated'
          case 'DEFAULT':
            return 'Group Settings'
          case 'PROHIBITED':
            return "Can't Post"
        }
      }

      return null
    },
    emailfrequency() {
      if (this.stdmsg) {
        switch (this.stdmsg.newdelstatus) {
          case 'DIGEST':
            return 24
          case 'NONE':
            return 0
          case 'SINGLE':
            return -1
          case 'ANNOUNCEMENT':
            return 0
        }
      }

      return 0
    },
    delstatus() {
      if (this.stdmsg) {
        switch (this.emailfrequency) {
          case 24:
            return 'Every Day'
          case 0:
            return 'Never'
          case -1:
            return 'Immediately'
        }
      }

      return 'Unknown'
    }
  },
  methods: {
    async show() {
      // Get the full standard message
      if (this.stdmsgid) {
        this.stdmsg = await this.$store.dispatch('stdmsgs/fetch', {
          id: this.stdmsgid
        })
      }

      // Calculate initial subject.
      if (this.stdmsg) {
        this.subject =
          (this.stdmsg.subjpref ? this.stdmsg.subjpref : 'Re') +
          ': ' +
          this.message.subject +
          (this.stdmsg.subjsuff ? this.stdmsg.subjsuff : '')
      } else {
        this.subject = 'Re: ' + this.message.subject
      }

      this.subject = this.substitutionStrings(this.subject)

      // Calculate initial body
      let msg = this.message.textbody

      if (msg) {
        // We have an existing body to include.
        msg = '> ' + msg.replace(/((\r\n)|\r|\n)/gm, '\n> ')

        if (this.stdmsg) {
          // Add text
          msg = (this.stdmsg.body ? this.stdmsg.body + '\n\n' : '') + msg
        }
      } else if (this.stdmsg) {
        // No existing body
        msg = this.stdmsg.body
      }

      this.body = this.substitutionStrings(msg)

      this.showModal = true
    },

    hide() {
      this.showModal = false
    },

    substitutionStrings(text) {
      const self = this
      const group = this.$store.getters['auth/groupById'](this.groupid)
      const msgdate = this.$dayjs(this.message.date)

      if (text) {
        if (this.modconfig) {
          text = text.replace(/\$networkname/g, this.modconfig.network)
          text = text.replace(
            /\$groupnonetwork/g,
            group.nameshort.replace(this.modconfig.network, '')
          )
        }

        text = text.replace(/\$groupname/g, group.nameshort)
        text = text.replace(/\$owneremail/g, group.modsemail)
        text = text.replace(/\$groupemail/g, group.groupemail)
        text = text.replace(/\$groupurl/g, group.url)
        text = text.replace(/\$myname/g, this.me.displayname)
        text = text.replace(/\$nummembers/g, group.membercount)
        text = text.replace(/\$nummods/g, group.modcount)

        text = text.replace(/\$origsubj/g, this.message.subject)

        if (this.message.fromuser) {
          const history = this.message.fromuser.messagehistory
          let recentmsg = ''
          let count = 0
          if (history.length) {
            history.forEach(msg => {
              if (msg.daysago < self.recentDays) {
                recentmsg += msgdate.format('lll') + ' - ' + msg.subject + '\n'
                count++
              }
            })
          }
          text = text.replace(/\$recentmsg/gim, recentmsg)
          text = text.replace(/\$numrecentmsg/gim, count)

          this.keywordList.forEach(keyword => {
            let recentmsg = ''
            let count = 0
            if (history.length) {
              history.forEach(msg => {
                if (msg.type === keyword && msg.daysago < self.recentDays) {
                  recentmsg +=
                    msgdate.format('lll') + ' - ' + msg.subject + '\n'
                  count++
                }
              })
            }

            text = text.replace(
              new RegExp('\\$recent' + keyword.toLowerCase(), 'gim'),
              recentmsg
            )
            text = text.replace(
              new RegExp('\\$numrecent' + keyword.toLowerCase(), 'gim'),
              count
            )
          })
        }

        text = text.replace(
          /\$memberreason/g,
          this.message.joincomment ? this.message.joincomment : ''
        )

        if (this.message.joined) {
          text = text.replace(
            /\$membersubdate/g,
            new this.$dayjs(this.message.joined).format('lll')
          )
        }

        text = text.replace(/\$membermail/g, this.message.fromaddr)
        const from = this.message.fromuser.realemail
          ? this.message.fromuser.realemail
          : this.message.fromaddr
        const fromid = from.substring(0, from.indexOf('@'))
        text = text.replace(/\$memberid/g, fromid)
        const membername = this.message.fromuser.displayname | fromid
        text = text.replace(/\$membername/g, membername)

        let summ = ''

        if (this.message.duplicates) {
          this.message.duplicates.forEach(m => {
            summ +=
              new this.$dayjs(m.date).format('lll') + ' - ' + m.subject + '\n'
          })

          const regex = new RegExp('\\$duplicatemessages', 'gim')
          text = text.replace(regex, summ)
        }
      }

      return text
    },

    async process() {
      if (this.stdmsg && this.stdmsg.newdelstatus) {
        await this.$store.dispatch('user/edit', {
          id: this.message.fromuser.id,
          groupid: this.groupid,
          emailfrequency: this.emailfrequency
        })
      }

      if (this.stdmsg && this.stdmsg.newmodstatus) {
        await this.$store.dispatch('user/edit', {
          id: this.message.fromuser.id,
          groupid: this.groupid,
          ourPostingStatus: this.stdmsg.newmodstatus
        })
      }

      if (this.stdmsg) {
        switch (this.stdmsg.action) {
          case 'Approve':
            await this.$store.dispatch('messages/approve', {
              id: this.message.id,
              groupid: this.groupid,
              subject: this.subject,
              body: this.body,
              stdmsgid: this.stdmsg.id
            })
            break
          case 'Leave':
            await this.$store.dispatch('messages/reply', {
              id: this.message.id,
              groupid: this.groupid,
              subject: this.subject,
              body: this.body,
              stdmsgid: this.stdmsg.id
            })
            break
          case 'Reject':
            await this.$store.dispatch('messages/reject', {
              id: this.message.id,
              groupid: this.groupid,
              subject: this.subject,
              body: this.body,
              stdmsgid: this.stdmsg.id
            })
            break
          case 'Delete':
            await this.$store.dispatch('messages/delete', {
              id: this.message.id,
              groupid: this.groupid,
              subject: this.subject,
              body: this.body,
              stdmsgid: this.stdmsg.id
            })
            break
          case 'Edit':
            // TODO
            break
          default:
            console.error('Unknown stdmsg action', this.action)
        }
      }
    }
  }
}
</script>
