// Build up our sitemap, including dynamic routes.

export default {
  includeRoutes: function() {
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
