import axios from 'axios'

axios.defaults.paramsSerializer = params => {
  const keys = Object.keys(params)
  let options = ''

  keys.forEach(key => {
    if (params[key] !== null) {
      const isParamTypeObject = typeof params[key] === 'object'

      if (!isParamTypeObject) {
        options += `${key}=${params[key]}&`
      } else {
        for (const element in params[key]) {
          options += `${key}[${element}]=${params[key][element]}&`
        }
      }
    }
  })

  return options ? options.slice(0, -1) : options
}
