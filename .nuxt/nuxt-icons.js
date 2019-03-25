export default async function (ctx, inject) {
  const moduleOptions = {"accessibleIcons":true,"iconProperty":"$icon","icons":{"64":"\u002F_nuxt\u002Ficons\u002Ficon_64.c10iMkLgzg5.png","120":"\u002F_nuxt\u002Ficons\u002Ficon_120.c10iMkLgzg5.png","144":"\u002F_nuxt\u002Ficons\u002Ficon_144.c10iMkLgzg5.png","152":"\u002F_nuxt\u002Ficons\u002Ficon_152.c10iMkLgzg5.png","192":"\u002F_nuxt\u002Ficons\u002Ficon_192.c10iMkLgzg5.png","384":"\u002F_nuxt\u002Ficons\u002Ficon_384.c10iMkLgzg5.png","512":"\u002F_nuxt\u002Ficons\u002Ficon_512.c10iMkLgzg5.png"}}
  inject(moduleOptions.iconProperty.replace('$', ''), retrieveIcons(moduleOptions.icons))
}

const retrieveIcons = icons => size => icons[size] || ''
