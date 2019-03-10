export default function({ store, redirect }) {
  // This is used on the login page; if the user is authenticated redirect to home page
  if (store.state.session.loggedin) {
    console.log('Already logged in, redirect')
    return redirect('/')
  }
}
