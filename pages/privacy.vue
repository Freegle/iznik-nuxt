<template>
  <!-- TODO DESIGN MINOR - Use a bootstrap container here rather than the grid/row layout -->
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <h1 class="text-center">
          Privacy
        </h1>
        <p>
          We won’t pass on your email address to anyone else, and other freeglers can't see it.
        </p>
        <p>
          Other freeglers can see your name, profile picture and approximate location.  If you don't want that, you can change it in <nuxt-link to="/settings">
            Settings.
          </nuxt-link>
        </p>
        <p>
          We try to protect you from spammers and fraudsters.  Sometimes our volunteers may read what you write to check
          that it's not spam, phishing or fraud.  If we happen to find something which is against Freegle rules,
          we may take further action.
        </p>
        <p>
          If you put phone numbers, email addresses or postal addresses into your posts on Freegle, other people will
          be able to see them.  If you're concerned about this, don't do it!
        </p>
        <p>
          So that potential new users can see what is being offered on Freegle, we make some details of posts public,
          i.e. the item name, approximate location, the description and any photos. No personal details are made public -
          unless in this information.
        </p>
        <h2>Cookies</h2>
        <p>
          Most modern websites use cookies and other ways of remembering things in your browser.  We do too.
          If you turn these off, then we're afraid the site won't work.
        </p>
        <p>
          If you're not sure what a cookie is, read about them <a href="http://en.wikipedia.org/wiki/HTTP_cookie" target="_blank" rel="noopener">here</a>.
        </p>
        <h2>Advertising</h2>
        <p>
          We don't sell your behaviour to advertisers, but we do use advertisements to support Freegle.  We'd prefer not to,
          but we don't raise enough from donations alone to keep going.
        </p>
        <p>
          We use Google AdSense (on the website). For emails we use AdView. We pass them your IP address, but not your personal information.
        </p>
        <h2>Got questions?</h2>
        <p>
          If you have questions, please <nuxt-link to="/help">
            contact us.
          </nuxt-link>
        </p>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </b-col>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'

export default {
  mixins: [buildHead],
  head() {
    return this.buildHead('Privacy', 'What data we keep and how we protect it')
  }
}
</script>
