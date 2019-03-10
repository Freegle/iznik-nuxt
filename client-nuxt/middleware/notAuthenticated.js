export default function({ store, redirect }) {
  // This is used on the login page; if the user is authenticated redirect to home page
  if (store.state.auth) {
    return redirect('/')
  }
}
