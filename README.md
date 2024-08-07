# iznik-nuxt

Iznik is a platform for online reuse of unwanted items.  This repo is now just used for ModTools.   
The new version of the front-end client for www.ilovefreegle.org is [here](https://github.com/Freegle/iznik-nuxt3).  

The development has been funded by [Freegle](https://www.ilovefreegle.org) for use in the UK, 
but it is an open source platform which can be used or adapted by others.  Other contributors very welcome,
especially those with design/UX expertise.

**It would be very lovely if you sponsored us.**

[:heart: Sponsor](https://github.com/sponsors/Freegle)

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

<img src="http://www.browserstack.com/images/layout/browserstack-logo-600x315.png" width="280"/>

[BrowserStack](http://www.browserstack.com) is supporting Freegle, allowing us to use their service and infrastructure to test the code in this repository. Thank you for supporting the open source community!
 
