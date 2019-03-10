export default function({ store, redirect }) {
  // If the user is not authenticated, redirect to the login page.
  if (!store.state.auth) {
    return redirect('/login')
  }
}
