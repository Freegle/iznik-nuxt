<template>
  <section class="container">
    <h1>Welcome</h1>
    <p>This is a simple tool to allow you to do a rota.</p>
    <ul>
      <li>You navigate using the links on the bar at the top.</li>
      <li>
        First configure the locations where people work in <nuxt-link to="/locations">
          Locations
        </nuxt-link>.
        You can include both real locations and any virtual ones, e.g. to allow people to be unavailable.
      </li>
      <li>
        Then configure the people in <nuxt-link to="/people">
          Locations
        </nuxt-link>.
      </li>
      <li>
        Then arrange the rota in <nuxt-link to="/bylocation">
          By Location
        </nuxt-link>.  This will stop you
        double-booking people.
      </li>
      <li>
        You can get a view of what individual people are doing in <nuxt-link to="/byperson">
          By Person
        </nuxt-link>.
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  middleware: 'loggedInOnly',

  components: {}
}
</script>
