# iznik-nuxt

Iznik is a platform for online reuse of unwanted items.  This is a work-in-progress rewrite of
the client half.  

The development has been funded by [Freegle](https://www.ilovefreegle.org) for use in the UK, 
but it is an open source platform which can be used or adapted by others.

License
=======

This code is licensed under the GPL v2 (see LICENSE file).  If you intend to use it, Freegle would be interested to
hear about it; you can mail <geeks@ilovefreegle.org>.

# Development

You'll need npm (>= v5.5.1) and node (>= 8.9.4).  Then install all the dependencies:
```
npm install
```

Then start the dev server:
```
npm run dev
```

This will serve up the site at [localhost:3000](http://localhost:3000).

It will watch for changes and do hot module reloading.

# Technologies

Briefly:
* [Nuxt](https://nuxtjs.org), which is [Vue](https://vuejs.org/) (so we get all 
that nice reactive stuff), with a standard layout and (crucially) a good Server Side 
Rendering solution.
* [BootstrapVue](https://bootstrap-vue.js.org/), which is Bootstrap v4 for Vue/Nuxt. 

# Current Status

This is still very much a proof of concept.
* You can log in, though the Sign Up half isn't done yet.
* The ChitChat/My Groups/Chat/Give/Find/My Posts/Notifications/Settings pages exist.  They are basically functional, but not complete.
* Events/Volunteer/Spread/Help don't exist.  There are lots of other bits and pieces, and many TODOs in the code.
* We've done a first pass for how it displays on a mobile, but there will be some niggles at different screen sizes.
* We've tested on Chrome only, and very few mobiles/tablets.
