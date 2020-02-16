// We often want to build up a return value for head(), but it only really varies in three ways.
// This is a helper for that.

export default {
  methods: {
    buildHead(title, description, image) {
      const meta = [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description
        },

        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description
        }
      ]

      const retImage = image || process.env.USER_SITE + '/icon.png'

      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: retImage
      })

      meta.push({
        hid: 'og:url',
        property: 'og:url',
        content: process.env.USER_SITE + this.$route.fullPath
      })

      meta.push({
        hid: 'twitter:image',
        property: 'twitter:image',
        content: retImage
      })

      return {
        title: title,
        meta: meta
      }
    }
  }
}
