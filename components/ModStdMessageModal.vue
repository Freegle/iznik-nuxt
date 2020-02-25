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
      <div v-if="stdmsg.action === 'Edit' && message.location" class="d-flex justify-content-start">
        <b-select v-model="message.type" :options="typeOptions" class="type mr-1" size="lg" />
        <b-input v-model="message.item.name" size="lg" class="mr-1" />
        <b-input-group>
          <Postcode :value="message.location.name" :find="false" @selected="postcodeSelect" />
        </b-input-group>
      </div>
      <div v-else>
        <b-input-group>
          <b-input v-model="subject" class="mt-2" />
        </b-input-group>
      </div>
      <NoticeMessage v-if="warning" variant="warning" class="mt-1 mb-1">
        <p>Please check your message in case it needs updating:</p>
        <p>
          <b>{{ warning }}</b>
        </p>
      </NoticeMessage>
      <b-textarea v-model="body" rows="10" class="mt-2" />
      <div v-if="stdmsg.newdelstatus && stdmsg.newdelstatus !== 'UNCHANGED'" class="mt-1">
        <v-icon name="cog" />
        Change email frequency to <em>{{ emailfrequency }}</em>
      </div>
      <div v-if="stdmsg.newmodstatus && stdmsg.newmodstatus !== 'UNCHANGED'" class="mt-1">
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
import Postcode from './Postcode'
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage, Postcode },
  props: {
    message: {
      type: Object,
      required: true
    },
    stdmsg: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      subject: null,
      body: null,
      keywordList: ['Offer', 'Taken', 'Wanted', 'Received', 'Other'],
      recentDays: 31
    }
  },
  computed: {
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
    typeOptions() {
      // TODO Per group keywords
      return [
        {
          value: 'Offer',
          text: 'OFFER'
        },
        {
          value: 'Wanted',
          text: 'WANTED'
        }
      ]
    },
    groupid() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        ret = this.message.groups[0].groupid
      }

      return ret
    },
    processLabel() {
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
          return 'Send'
      }
    },
    modstatus() {
      switch (this.stdmsg.newmodstatus) {
        case 'UNCHANGED':
          return 'Unchanged'
        case 'MODERATOED':
          return 'Moerated'
        case 'DEFAULT':
          return 'Group Settings'
        case 'PROHIBITED':
          return "Can't Post"
        default:
          return null
      }
    },
    emailfrequency() {
      switch (this.stdmsg.newdelstatus) {
        case 'DIGEST':
          return 24
        case 'NONE':
          return 0
        case 'SINGLE':
          return -1
        case 'ANNOUNCEMENT':
          return 0
        default:
          return 0
      }
    },
    delstatus() {
      switch (this.emailfrequency) {
        case 24:
          return 'Every Day'
        case 0:
          return 'Never'
        case -1:
          return 'Immediately'
        default:
          return 'Unknown'
      }
    },
    warning() {
      let ret = null

      if (this.body) {
        const checks = {
          yahoo:
            'Yahoo Groups is no longer supported, so any mention of it is probably out of date.',
          republisher:
            'Republisher is old and any mention of it is probably not valid any more.',
          messagemaker:
            'The Message Maker is no longer a separate tool; please just refer people to www.ilovefreegle.org.',
          cafe:
            'The ChitChat area of the site is the please for cafe-type requests now.',
          newsfeed: 'Newsfeed is now called ChitChat.',
          freegledirect:
            'Freegle Direct is no longer an active term; we just talk about "our website" now.'
        }

        const trimmed = this.body.replace(/\s/g, '').toLowerCase()
        for (const keyword in checks) {
          if (trimmed.indexOf(keyword) !== -1) {
            ret = checks[keyword]
          }
        }
      }

      return ret
    }
  },
  methods: {
    show() {
      // Calculate initial subject.
      this.subject =
        (this.stdmsg.subjpref ? this.stdmsg.subjpref : 'Re') +
        ': ' +
        this.message.subject +
        (this.stdmsg.subjsuff ? this.stdmsg.subjsuff : '')

      this.subject = this.substitutionStrings(this.subject)

      // Calculate initial body
      let msg = this.message.textbody

      if (msg) {
        // We have an existing body to include.  Quote it, unless it's an edit.
        const edit = this.stdmsg && this.stdmsg.action === 'Edit'
        if (!edit) {
          msg = '> ' + msg.replace(/((\r\n)|\r|\n)/gm, '\n> ')
        }

        if (this.stdmsg) {
          if (this.stdmsg.body) {
            // Text to insert.
            if (this.stdmsg.insert === 'Top') {
              msg = this.stdmsg.body.trim() + '\n\n' + msg
            } else {
              msg = msg + '\n\n' + this.stdmsg.body.trim()
            }
          } else if (msg) {
            // No text to insert - add a couple of blank lines at the top for typing.
            msg = '\n\n' + msg
          }

          if (this.stdmsg.edittext === 'Correct Case') {
            // First the subject
            const matches = /(.*?):([^)].*)\((.*)\)/.exec(this.subject)
            if (matches && matches.length > 0 && matches[0].length > 0) {
              this.subject =
                matches[1] +
                ': ' +
                matches[2].toLowerCase().trim() +
                ' (' +
                matches[3] +
                ')'
            } else {
              this.subject = this.subject.toLowerCase().trim()
            }

            // Now the this.textbody.
            msg = msg.toLowerCase()

            // Contentious choice of single space
            msg = msg.replace(/\.( |(&nbsp;))+/g, '. ')
            msg = msg.replace(/\.\n/g, '.[-<br>-]. ')
            msg = msg.replace(/\.\s\n/g, '. [-<br>-]. ')
            const wordSplit = '. '
            const wordArray = msg.split(wordSplit)
            const numWords = wordArray.length

            for (let x = 0; x < numWords; x++) {
              if (wordArray[x]) {
                wordArray[x] = wordArray[x].replace(
                  wordArray[x].charAt(0),
                  wordArray[x].charAt(0).toUpperCase()
                )

                if (x === 0) {
                  msg = wordArray[x] + '. '
                } else if (x !== numWords - 1) {
                  msg = msg + wordArray[x] + '. '
                } else if (x === numWords - 1) {
                  msg = msg + wordArray[x]
                }
              }
            }

            msg = msg.replace(/\[-<br>-\]\.\s/g, '\n')
            msg = msg.replace(/\si\s/g, ' I ')
            msg = msg.replace(/(<p>.)/i, (a, b) => {
              return b.toUpperCase()
            })
          }
        }
      } else if (this.stdmsg) {
        // No existing body
        msg = '\n\n' + this.stdmsg.body
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
      if (
        this.stdmsg.newdelstatus &&
        this.stdmsg.newdelstatus !== 'UNCHANGED'
      ) {
        await this.$store.dispatch('user/edit', {
          id: this.message.fromuser.id,
          groupid: this.groupid,
          emailfrequency: this.emailfrequency
        })
      }

      if (
        this.stdmsg.newmodstatus &&
        this.stdmsg.newmodstatus !== 'UNCHANGED'
      ) {
        await this.$store.dispatch('user/edit', {
          id: this.message.fromuser.id,
          groupid: this.groupid,
          ourPostingStatus: this.stdmsg.newmodstatus
        })
      }

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
        case 'Leave Approved Message':
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
        case 'Delete Approved Message':
          await this.$store.dispatch('messages/delete', {
            id: this.message.id,
            groupid: this.groupid,
            subject: this.subject,
            body: this.body,
            stdmsgid: this.stdmsg.id
          })
          break
        case 'Edit':
          if (this.message.location) {
            // Well-structured message
            await this.$store.dispatch('messages/patch', {
              id: this.message.id,
              msgtype: this.message.type,
              item: this.message.item.name,
              location: this.message.location.name,
              textbody: this.body
            })
          } else {
            // Not
            await this.$store.dispatch('messages/patch', {
              id: this.message.id,
              subject: this.subject,
              textbody: this.body
            })
          }
          break
        default:
          console.error('Unknown stdmsg action', this.stdmsg.action)
      }

      this.hide()
    }
  }
}
</script>
