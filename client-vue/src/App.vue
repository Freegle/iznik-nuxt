
<template>
  <div class="container">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Rotavator</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'LocationList' }" >
            Locations
          </b-nav-item>
          <b-nav-item :to="{ name: 'PersonList' }" >
            People
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nav>
      <ul class="nav nav-justified">
      </ul>
    </nav>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>