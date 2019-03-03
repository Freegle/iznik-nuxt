import SubmissionError from '../error/SubmissionError'
import { ENTRYPOINT } from '../config/entrypoint';

const MIME_TYPE = 'application/ld+json'

export default function (id, options = {}) {
  if (typeof options.headers === 'undefined') Object.assign(options, { headers: new Headers() })

  if (options.headers.get('Accept') === null) options.headers.set('Accept', MIME_TYPE)

  if (options.body !== undefined && !(options.body instanceof FormData) && options.headers.get('Content-Type') === null) {
    options.headers.set('Content-Type', MIME_TYPE)
  }

  return fetch(new URL(id, ENTRYPOINT).toString(), options).then((response) => {
    if (response.ok) return response

    return response
      .json()
      .then((json) => {
        const error = json['hydra:description'] ? json['hydra:description'] : response.statusText
        if (!json.violations) throw Error(error)

        const errors = { _error: error }
        json.violations.map(violation =>
          Object.assign(errors, { [violation.propertyPath]: violation.message }))

        throw new SubmissionError(errors)
      })
  })
}
