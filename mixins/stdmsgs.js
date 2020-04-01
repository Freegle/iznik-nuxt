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
          return 'success'
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
    }
  }
}
