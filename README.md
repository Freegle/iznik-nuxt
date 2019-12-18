# iznik-nuxt

Iznik is a platform for online reuse of unwanted items.  This is a work-in-progress rewrite of
the existing client, which you can find [here](https://github.com/Freegle/iznik-client).  

The aim is to produce 
something that looks very much like the existing site, but with a more modern codebase, and a fair number of
niggles smoothed out.  More significant changes can come later.  

The development has been funded by [Freegle](https://www.ilovefreegle.org) for use in the UK, 
but it is an open source platform which can be used or adapted by others.  Other contributors very welcome,
especially those with design/UX expertise.

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

This is getting close to Beta.
* The pages you can access from the menu bar are basically done.
* There are lots of other bits and pieces, and many TODOs in the code.
* We've done a first pass for how it displays on a mobile, but there will be some niggles at different screen sizes.
* We've tested on Chrome only, and very few mobiles/tablets.

There are some specific pages that still need doing:
* Plugins - are they still used?
* /mydata
* /councils

<img src="http://www.browserstack.com/images/layout/browserstack-logo-600x315.png" width="280"/>

[BrowserStack](http://www.browserstack.com) is supporting Freegle, allowing us to use their service and infrastructure to test the code in this repository. Thank you for supporting the open source community!
