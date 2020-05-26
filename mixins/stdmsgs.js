export default {
  methods: {
    icon(stdmsg) {
      switch (stdmsg.action) {
        case 'Approve':
          return 'check'
        case 'Reject':
          return 'times'
        case 'Leave':
        case 'Leave Approved Message':
          return 'envelope'
        case 'Delete':
        case 'Delete Approved Message':
          return 'trash-alt'
        case 'Edit':
          return 'pen'
        default:
          return 'check'
      }
    },

    variant(stdmsg) {
      switch (stdmsg.action) {
        case 'Approve':
          return 'primary'
        case 'Reject':
          return 'warning'
        case 'Leave':
        case 'Leave Approved Message':
          return 'primary'
        case 'Delete':
        case 'Delete Approved Message':
          return 'danger'
        case 'Edit':
          return 'primary'
        default:
          return 'white'
      }
    },

    copyStdMsgs(config) {
      // We need to sort them according to the message order.
      let order = config.messageorder
      let copy = []
      const dups = []

      if (order) {
        order = JSON.parse(order)
        do {
          const thisone = parseInt(order.shift())

          if (!dups[thisone]) {
            config.stdmsgs.forEach(s => {
              if (thisone === parseInt(s.id)) {
                copy.push(s)
                dups[thisone] = true
              }
            })
          }
        } while (order.length)

        // Might have some which aren't listed in the order - they go at the end.
        config.stdmsgs.forEach(s => {
          const thisone = parseInt(s.id)
          if (order.indexOf(thisone) === -1 && !dups[thisone]) {
            copy.push(s)
            dups[thisone] = true
          }
        })
      } else {
        copy = config.stdmsgs
      }

      return copy
    }
  }
}
