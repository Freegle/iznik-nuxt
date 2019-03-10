export default function({ store, redirect }) {
  // If the user is not authenticated, redirect to the login page.
  if (!store.state.session.loggedin) {
    console.log('Not logged in, redirect')
    return redirect('/login')
  }
}
