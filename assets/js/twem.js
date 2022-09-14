const twem = {
  twem: function(twemoji, msg) {
    try {
      if (typeof msg === 'number') {
        // This can happen if people post just numeric values.
        msg += ''
      }

      if (typeof msg === 'string') {
        msg = msg.replace(/\\\\u(.*?)\\\\u/g, function(
          match,
          contents,
          offset,
          s
        ) {
          s = contents.split('-')

          let ret = ''

          for (const t of s) {
            ret += twemoji.convert.fromCodePoint(t)
          }

          return ret
        })
      }
    } catch (e) {
      console.log('twem error', e)
    }

    return msg
  },

  untwem: function(twemoji, msg) {
    try {
      msg = twemoji.replace(msg, function(emoji) {
        return '\\\\u' + twemoji.convert.toCodePoint(emoji) + '\\\\u'
      })
    } catch (e) {
      console.log('untwem error:', e)
    }

    return msg
  }
}

export default twem
