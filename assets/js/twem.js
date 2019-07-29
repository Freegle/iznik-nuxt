const twem = {
  twem: function(twemoji, msg) {
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

    return msg
  },

  untwem: function(twemoji, msg) {
    msg = twemoji.replace(msg, function(emoji) {
      return '\\\\u' + twemoji.convert.toCodePoint(emoji) + '\\\\u'
    })

    return msg
  }
}

export default twem
