export default ({ $axios, store }) => {
  $axios.onRequest(config => {
    console.log('Making request to ' + JSON.stringify(config))
  })

  $axios.onResponse(response => {
    console.log('Response ' + `[${response.status}] ${response.request.path}`)
  })

  $axios.onError(err => {
    console.log(
      `[${err.response && err.response.status}] ${err.response &&
        err.response.request.path}`
    )
    console.log(err.response && err.response.data)
  })
}
