const twem = function(twemoji, msg) {
  console.log('Type of', msg, typeof msg, twemoji)
  if (typeof msg === 'string') {
    msg = msg.replace(/\\\\u(.*?)\\\\u/g, function(match, contents, offset, s) {
      s = contents.split('-')

      let ret = ''

      for (const t of s) {
        ret += twemoji.convert.fromCodePoint(t)
      }

      console.log('Decoded', ret)
      return ret
    })
  }

  return msg
}

export default twem
