if (process.env.NODE_ENV === 'production') {
}

if (process.client) {
  ;(function() {
    window.__insp = window.__insp || []
    window.__insp.push(['wid', 1810954883])
    const ldinsp = function() {
      if (typeof window.__inspld !== 'undefined') return
      window.__inspld = 1
      const insp = document.createElement('script')
      insp.type = 'text/javascript'
      insp.async = true
      insp.id = 'inspsync'
      insp.src =
        (document.location.protocol === 'https:' ? 'https' : 'http') +
        '://cdn.inspectlet.com/inspectlet.js?wid=1810954883&r=' +
        Math.floor(new Date().getTime() / 3600000)
      const x = document.getElementsByTagName('script')[0]
      x.parentNode.insertBefore(insp, x)
    }
    setTimeout(ldinsp, 0)
  })()
}
