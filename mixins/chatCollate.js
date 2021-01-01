export default {
  methods: {
    chatCollate(msgs) {
      const ret = []
      let last = ''

      for (let i = 0; i < msgs.length; i++) {
        if (
          i + 1 < msgs.length &&
          msgs[i].sameasnext &&
          msgs[i].message &&
          msgs[i].type === 'Default' &&
          msgs[i + 1].type === 'Default' &&
          !msgs[i].refmsg &&
          !msgs[i + 1].refmsg &&
          msgs[i + 1].message &&
          (!msgs[i].replyexpected || msgs[i].replyreceived) &&
          new Date(msgs[i + 1].date).getTime() -
            new Date(msgs[i].date).getTime() <
            10 * 60 * 1000
        ) {
          // The next message is within from the same user, within ten minutes, and not expecting a reply (in which
          // case we want to show that).   Collate.
          last += '\n' + msgs[i].message
        } else if (last) {
          // We have collated text to pull in.  Need to avoid references.
          const thisone = JSON.parse(JSON.stringify(msgs[i]))
          thisone.message = last + '\n' + msgs[i].message
          ret.push(thisone)
          last = ''
        } else {
          ret.push(msgs[i])
        }
      }

      return ret
    }
  }
}
