<template>
  <div class="container">
    <nav>
      <ul class="nav nav-justified">
        <li class="active"><router-link :to="{ name: 'LocationList' }" class="active">Locations</router-link></li>
        <li class="active"><router-link :to="{ name: 'PersonList' }" class="active">People</router-link></li>
      </ul>
    </nav>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>