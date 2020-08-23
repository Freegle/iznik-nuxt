import pluralize from 'pluralize'

function ourPlural(...args) {
  // NPM pluralize doesn't handle plurals like 'OFFERs' well, and results in 'offers'.  Fix those up.
  let ret = pluralize(...args)

  const odds = ['OFFER', 'WANTED', 'RSVP']
  odds.forEach(w => {
    ret = ret.replace(w.toLowerCase(), w)
  })

  return ret
}

export default (context, inject) => {
  // We need some special case rules.
  pluralize.addPluralRule('serves', 'serve')
  pluralize.addPluralRule('freegler is', 'freeglers are')
  pluralize.addPluralRule('open OFFER', 'open OFFERs')
  pluralize.addPluralRule('open WANTED', 'open WANTEDs')
  pluralize.addPluralRule('recent OFFER', 'recent OFFERs')
  pluralize.addPluralRule('recent WANTED', 'recent WANTEDs')
  pluralize.addPluralRule('old OFFER', 'old OFFERs')
  pluralize.addPluralRule('old WANTED', 'old WANTEDs')
  pluralize.addPluralRule('email address', 'email addresses')
  pluralize.addPluralRule('more note', 'more notes')
  pluralize.addPluralRule('new post', 'new posts')
  pluralize.addPluralRule('new member', 'new members')
  pluralize.addPluralRule('OFFER', 'OFFERs')
  pluralize.addPluralRule('WANTED', 'WANTEDs')
  pluralize.addPluralRule('RSVP', 'RSVPs')
  pluralize.addPluralRule('page has', 'pages have')
  pluralize.addPluralRule('community needs', 'communities need')
  pluralize.addPluralRule('group is', 'groups are')
  pluralize.addPluralRule('account has', 'accounts have')
  pluralize.addPluralRule('day ago', 'days ago')

  inject('pluralize', ourPlural)
}
