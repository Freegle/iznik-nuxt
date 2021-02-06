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
        url: '/help',
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
        url: '/stats',
        changefreq: 'monthly',
        priority: 0.1
      },
      {
        url: '/stats/authorities',
        changefreq: 'monthly',
        priority: 0.1
      }
    ]

    const API = process.env.API ? process.env.API : 'http://localhost:3000/api'
    const res = await a.get(API + '/groups', {
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

    // "What to do with a" pages for common items.
    ;[
      'armchair',
      'baby bath',
      'bed',
      'bed frame',
      'book',
      'bookcase',
      'bread maker',
      'bubble wrap',
      'bunk bed',
      'car seat',
      'carpet',
      'chainsaw',
      'chair',
      'chest of drawers',
      'christmas tree',
      'coat hanger',
      'computer',
      'cooker',
      'curtains',
      'cushion',
      'dehumidifier',
      'desk',
      'dishwasher',
      'dressing table',
      'dvd player',
      'exercise bike',
      'filing cabinet',
      'fish tank',
      'food processor',
      'freeview box',
      'freezer',
      'fridge',
      'fridge freezer',
      'furniture',
      'garden shed',
      'greenhouse',
      'high chair',
      'hoover',
      'ironing board',
      'jam jar',
      'juicer',
      'kettle',
      'kitchen unit',
      'laptop',
      'mattress',
      'microwave',
      'microwave oven',
      'mirror',
      'monitor',
      'moving box',
      'oven',
      'paint',
      'pallet',
      'paving slab',
      'piano',
      'printer',
      'rug',
      'sewing machine',
      'shoe rack',
      'slow cooker',
      'sofa',
      'sofabed',
      'stair gate',
      'table',
      'table',
      'table',
      'toaster',
      'travel cot',
      'treadmill',
      'tumble dryer',
      'tv stand',
      'tv unit',
      'vacuum cleaner',
      'wardrobe',
      'washing machine',
      'wheelbarrow',
      'wheelchair'
    ].forEach(i => {
      routes.push({
        url: '/what-to-do-with-a/' + i,
        changefreq: 'daily',
        priority: 0.2
      })
    })

    return routes
  },

  excludeRoutes: [
    '/browse',
    '/communities',
    '/find/**',
    '/give/**',
    '/yahoologin',
    '/mydata',
    '/settings',
    '/shortlinks',
    '/promote',
    '/stats/heatmap',
    '/stories/fornewsletter',
    '/myposts'
  ]
}
