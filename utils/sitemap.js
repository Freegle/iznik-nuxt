// Build up our sitemap, including dynamic routes.
const axios = require('axios')

export default {
  includeRoutes: async function() {
    // Construct the routes.
    //
    // Google probably ignores priority and changefreq.  But it doesn't seem to do any harm.
    const a = axios.create()

    const routes = [
      {
        url: '/',
        changefreq: 'monthly',
        priority: 1
      },
      {
        url: '/give',
        changefreq: 'monthly',
        priority: 1
      },
      {
        url: '/find',
        changefreq: 'monthly',
        priority: 1
      },
      {
        url: '/explore',
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: '/councils',
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        url: '/unsubscribe',
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        url: '/donate',
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        url: '/contact',
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        url: '/help',
        changefreq: 'monthly',
        priority: 0.5
      },
      {
        url: '/stories',
        changefreq: 'daily',
        priority: 0.5
      },
      {
        url: '/about',
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/livemap',
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/mobile',
        changefreq: 'monthly',
        priority: 0.3
      },
      {
        url: '/disclaimer',
        changefreq: 'monthly',
        priority: 0.1
      },
      {
        url: '/terms',
        changefreq: 'monthly',
        priority: 0.1
      },
      {
        url: '/privacy',
        changefreq: 'monthly',
        priority: 0.1
      },
      {
        url: '/stats/authorities',
        changefreq: 'monthly',
        priority: 0.1
      }
    ]

    const API = process.env.API ? process.env.API : 'http://localhost:3000'
    console.log('API', process.env.API)
    const res = await a.get(API + '/api/groups', {
      params: {
        grouptype: 'Freegle'
      }
    })

    if (res.status === 200 && res.data.ret === 0) {
      // We could include lastmod, but it would require an extra API call.  And Google probably ignores it.
      const groups = res.data.groups

      groups.forEach(group => {
        routes.push({
          url: '/explore/' + group.nameshort,
          changefreq: 'daily',
          priority: 0.2
        })
      })
    }

    return routes
  },

  excludeRoutes: [
    '/communities',
    '/find/**',
    '/give/**',
    '/yahoologin',
    '/mydata',
    '/settings',
    '/shortlinks',
    '/spread',
    '/stats/heatmap',
    '/stories/fornewsletter',
    '/myposts'
  ]
}
